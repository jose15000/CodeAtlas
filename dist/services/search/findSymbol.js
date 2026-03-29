export function findSymbol(graph, symbol) {
    const lower = symbol.toLowerCase();
    const matches = Array.from(graph.nodes.values()).filter(n => {
        const name = n.data?.name || n.id;
        return name.toLowerCase().includes(lower);
    });
    return matches.slice(0, 50);
}
