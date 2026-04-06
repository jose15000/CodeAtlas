import { SourceFile, TypeChecker } from "ts-morph";
import type { Graph } from "../../core/graph/Graph.js";
/**
 * Indexes arrow functions and function expressions inside exported object literals,
 * e.g., `export const SearchHandlers = { handleFind: async (graph, q) => {...} }`.
 * This is needed for MCP handlers and similar patterns that `getFunctions()` does not capture.
 */
export declare function indexExportedObjects(sourceFile: SourceFile, graph: Graph, typeChecker: TypeChecker, isProjectFile: (fp: string) => boolean): Promise<void>;
//# sourceMappingURL=exportedObjects.d.ts.map