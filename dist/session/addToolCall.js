export function addToolCall(graph, tool, thought) {
    const id = "tool_" + Date.now();
    graph.addNode({
        id: id,
        type: "tool_call",
        data: { tool }
    });
    graph.addEdge({
        from: thought,
        to: id,
        type: "CALLS_TOOL"
    });
}
