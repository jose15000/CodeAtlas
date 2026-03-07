export function addPrompt(graph, prompt) {
    const id = "prompt_" + Date.now();
    graph.addNode({
        id,
        type: "user_prompt",
        data: { prompt }
    });
    return id;
}
