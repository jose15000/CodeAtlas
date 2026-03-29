import { expandGraph } from "../../expansion/expandGraph.js";
export function expandNode(graph, nodeId, depth) {
    if (!graph.nodes.has(nodeId)) {
        throw new Error(`Node '${nodeId}' not found in the graph.`);
    }
    return expandGraph(graph, nodeId, depth, true);
}
