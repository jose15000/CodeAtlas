import { Graph } from "../core/graph/Graph.js";
import { Node } from "../core/graph/models/Node.js";
import { Edge } from "../core/graph/models/Edge.js";
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