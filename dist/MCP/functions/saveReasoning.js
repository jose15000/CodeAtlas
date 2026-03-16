import { addReasoning, saveReasoningGraph } from "../../graph/reasoning/reasoningGraph.js";
export function saveReasoning(reasoningGraph, reasoning) {
    addReasoning(reasoningGraph, reasoning);
    saveReasoningGraph(reasoningGraph);
    return {
        content: [{
                type: "text",
                text: `Reasoning saved (${reasoningGraph.nodes.size} total entries in memory).`
            }]
    };
}
