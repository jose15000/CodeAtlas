import { SyntaxKind, } from "ts-morph";
/**
 * Indexes arrow functions and function expressions inside exported object literals,
 * e.g., `export const SearchHandlers = { handleFind: async (graph, q) => {...} }`.
 * This is needed for MCP handlers and similar patterns that `getFunctions()` does not capture.
 */
export async function indexExportedObjects(sourceFile, graph, typeChecker, isProjectFile) {
    const filePath = sourceFile.getFilePath();
    for (const varDecl of sourceFile.getVariableDeclarations()) {
        const objInit = varDecl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
        if (!objInit)
            continue;
        const parent = varDecl.getParent();
        const stmt = parent.getParent();
        if (!stmt || !stmt.hasExportKeyword())
            continue;
        const objectName = varDecl.getName();
        if (!objectName)
            continue;
        const props = objInit.getProperties();
        for (const prop of props) {
            if (!prop.isKind(SyntaxKind.PropertyAssignment))
                continue;
            const propName = prop.getName();
            if (!propName)
                continue;
            const initializer = prop.getInitializer();
            if (!initializer)
                continue;
            const fnKinds = [
                SyntaxKind.ArrowFunction,
                SyntaxKind.FunctionExpression,
            ];
            const isFn = fnKinds.includes(initializer.getKind());
            if (!isFn)
                continue;
            const fnId = `${filePath}#${objectName}.${propName}`;
            // Extract params from any callable-like node
            const fnLike = initializer;
            const params = typeof fnLike.getParameters === 'function'
                ? fnLike.getParameters().map(p => p.getText()).join(', ')
                : '';
            graph.addNode({
                graphType: "Code",
                id: fnId,
                type: "function",
                data: { name: `${objectName}.${propName}` }
            });
            graph.addEdge({ from: filePath, to: fnId, type: "DEFINES" });
            // Index CALLS inside the handler
            for (const callExpr of initializer.getDescendantsOfKind(SyntaxKind.CallExpression)) {
                const symbol = typeChecker.getSymbolAtLocation(callExpr.getExpression());
                const valueDec = symbol?.getValueDeclaration();
                if (!valueDec)
                    continue;
                const targetFile = valueDec.getSourceFile().getFilePath();
                if (!isProjectFile(targetFile))
                    continue;
                const targetName = symbol.getName();
                const targetClass = valueDec.getParent();
                const isMethod = targetClass?.isKind(SyntaxKind.ClassDeclaration) ?? false;
                const className = targetClass?.asKind(SyntaxKind.ClassDeclaration)?.getName();
                const qualifiedName = isMethod && className
                    ? `${className}.${targetName}`
                    : targetName;
                graph.addEdge({
                    from: fnId,
                    to: `${targetFile}#${qualifiedName}`,
                    type: "CALLS"
                });
            }
        }
    }
}
