import { Graph } from "../../graph/Graph.js";
import { addReasoning, saveReasoningGraph } from "../../graph/reasoning/reasoningGraph.js";

export function saveReasoning(reasoningGraph: Graph, prompt: string, thought: string, solution: string) {
    addReasoning(reasoningGraph, prompt, thought, solution);
    saveReasoningGraph(reasoningGraph);

    return {
        content: [{
            type: "text" as const,
            text: `Reasoning saved (${reasoningGraph.nodes.size} total entries in memory).`
        }]
    };
}
