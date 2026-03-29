import { addReasoning, saveReasoningGraph } from "../../graph/reasoning/reasoningGraph.js";
export async function saveReasoning(reasoningGraph, reasoning) {
    await addReasoning(reasoningGraph, { reasoning });
    saveReasoningGraph(reasoningGraph);
    return { size: reasoningGraph.nodes.size };
}
