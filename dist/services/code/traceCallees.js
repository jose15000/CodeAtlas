export function traceCallees(graph, nodeId) {
    const callees = graph.edges.filter(e => e.type === "CALLS" && e.from === nodeId);
    const calleeIds = Array.from(new Set(callees.map(e => e.to)));
    return calleeIds.map(id => graph.nodes.get(id)).filter(Boolean);
}
