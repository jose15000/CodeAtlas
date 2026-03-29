import { expandNode } from "../../services/graph/expandNode.js";
export const GraphHandlers = {
    handleExpandNode: async (graph, nodeId, depth) => {
        try {
            const { nodes, edges } = expandNode(graph, nodeId, depth);
            const nodesText = nodes.map(n => `[${n.type}] ${n.data?.name ?? n.id} (${n.id})`).join("\n");
            const edgesText = edges.map((e) => `${e.from.split("#").pop()} --[${e.type}]--> ${e.to.split("#").pop()}`).join("\n");
            const output = `=== Nodes (${nodes.length}) ===\n${nodesText}\n\n=== Edges (${edges.length}) ===\n${edgesText}`;
            return { content: [{ type: "text", text: output }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: error.message }],
                isError: true
            };
        }
    }
};
