import { Graph } from "../graph/Graph.js";
import { Node } from "../types/Node.js";
import { Edge } from "../types/Edge.js";
export interface ExpandResult {
    nodes: Node[];
    edges: Edge[];
}
/**
 * BFS expansion from a starting node.
 * @param bidirectional - if true, follows edges in both directions (from OR to).
 *                        if false, only follows outgoing edges.
 * @param maxNodes      - safety cap to avoid huge output (default 200)
 */
export declare function expandGraph(graph: Graph, start: string, depth?: number, bidirectional?: boolean, maxNodes?: number): ExpandResult;
//# sourceMappingURL=expandGraph.d.ts.map