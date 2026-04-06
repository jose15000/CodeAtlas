import { Graph } from "../core/graph/Graph.js";
export declare function saveGraph(graph: Graph, filePath: string, mtimes?: Record<string, number>): void;
export declare function loadGraph(filePath: string): Graph | null;
export declare function loadGraphWithMtimes(filePath: string): {
    graph: Graph;
    mtimes: Record<string, number>;
} | null;
export declare function debounceSaveGraph(graph: Graph, filePath: string, mtimes?: Record<string, number>, delayMs?: number): void;
export declare function flushAllSaves(): void;
//# sourceMappingURL=persistence.d.ts.map