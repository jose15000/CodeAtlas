export function addCodeChange(graph, change, thought) {
    const id = "codeChange_" + Date.now();
    graph.addNode({
        id: id,
        type: "code_change",
        data: { change }
    });
    graph.addEdge({
        from: thought,
        to: id,
        type: "MODIFIES"
    });
}
