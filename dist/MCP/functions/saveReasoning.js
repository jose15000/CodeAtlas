import { addReasoning, saveReasoningGraph } from "../../graph/reasoning/reasoningGraph.js";
export function saveReasoning(reasoningGraph, prompt, thought, solution) {
    addReasoning(reasoningGraph, prompt, thought, solution);
    saveReasoningGraph(reasoningGraph);
    return {
        content: [{
                type: "text",
                text: `Reasoning saved (${reasoningGraph.nodes.size} total entries in memory).`
            }]
    };
}
