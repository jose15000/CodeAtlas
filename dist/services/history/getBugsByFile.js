export function getBugsByFile(graph, file) {
    const matches = Array.from(graph.nodes.values()).filter(n => n.data?.file?.includes(file) && n.data?.reasoning?.thoughtDetails === "bug");
    return matches;
}
