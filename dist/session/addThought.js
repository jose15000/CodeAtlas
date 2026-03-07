export function addThought(graph, promptId, thought) {
    const id = "thought_" + Date.now();
    graph.addNode({
        id: id,
        type: "agent_thought",
        data: { thought }
    });
    graph.addEdge({
        from: promptId,
        to: id,
        type: "GENERATED_BY"
    });
}
