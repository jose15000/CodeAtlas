export function searchSymbol(graph, query) {
    const lowerQuery = query.toLowerCase();
    const matches = Array.from(graph.nodes.values()).filter(n => {
        const name = n.data?.name || n.id;
        return name.toLowerCase().includes(lowerQuery);
    });
    return matches.slice(0, 50);
}
