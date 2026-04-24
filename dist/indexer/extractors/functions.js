import { SyntaxKind } from "ts-morph";
export async function indexFunctions(sourceFile, graph, typeChecker, isProjectFile) {
    const filePath = sourceFile.getFilePath();
    for (const fn of sourceFile.getFunctions()) {
        const fnName = fn.getName();
        if (!fnName)
            continue;
        const params = fn.getParameters().map(p => p.getText()).join(', ');
        const returnType = fn.getReturnTypeNode()?.getText() || 'void';
        const jsDoc = fn.getJsDocs()[0]?.getInnerText() || '';
        const fnId = `${filePath}#${fnName}`;
        graph.addNode({ graphType: "Code", id: fnId, type: "function", data: { name: fnName } });
        graph.addEdge({ from: filePath, to: fnId, type: "DEFINES" });
        for (const callExpr of fn.getDescendantsOfKind(SyntaxKind.CallExpression)) {
            const symbol = typeChecker.getSymbolAtLocation(callExpr.getExpression());
            const valueDec = symbol?.getValueDeclaration();
            if (!valueDec)
                continue;
            const targetFile = valueDec.getSourceFile().getFilePath();
            if (!isProjectFile(targetFile))
                continue;
            const targetName = symbol.getName();
            const targetClass = valueDec.getParent();
            const isMethod = targetClass && targetClass.isKind(SyntaxKind.ClassDeclaration);
            const qualifiedName = isMethod && targetClass.getName()
                ? `${targetClass.getName()}.${targetName}`
                : targetName;
            graph.addEdge({
                from: fnId,
                to: `${targetFile}#${qualifiedName}`,
                type: "CALLS"
            });
        }
    }
}
