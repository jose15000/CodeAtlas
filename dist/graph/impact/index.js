// Edge-type specific weights for impact propagation
const EDGE_WEIGHTS = {
    CALLS: 1.0, // Direct call dependency — full impact
    IMPORTS: 0.7, // Imported module changed — indirect impact
    DEFINES: 0.3, // Same-file containment — low impact
    IMPLEMENTS: 0.5, // Interface/implementation coupling
};
/**
 * Measures the impact of changes to a set of nodes in the graph.
 * Impact propagates backwards through edges (from dependency to dependent).
 *
 * @param graph The code graph
 * @param modifiedNodeIds IDs of nodes that were changed
 * @param threshold Minimum impact score to continue propagation (default: 0.01)
 * @returns A Map of nodeId to impact score (0 to 1)
 */
export function measureCodeImpact(graph, modifiedNodeIds, threshold = 0.01) {
    const impactScores = new Map();
    const queue = [];
    // Initialize modified nodes with maximum impact
    for (const id of modifiedNodeIds) {
        if (graph.getNode(id)) {
            impactScores.set(id, 1.0);
            queue.push(id);
        }
    }
    let head = 0;
    while (head < queue.length) {
        const nodeId = queue[head++];
        const currentImpact = impactScores.get(nodeId) ?? 0;
        // Find nodes that depend on this node via CALLS, DEFINES, or IMPLEMENTS
        const incomingEdges = graph.getEdgesTo(nodeId);
        for (const edge of incomingEdges) {
            // Skip IMPORTS edges here — they have the reverse direction
            // (importer → imported) and are handled below
            if (edge.type === "IMPORTS")
                continue;
            const dependentId = edge.from;
            const weight = edge.weight ?? EDGE_WEIGHTS[edge.type] ?? 1.0;
            const edgeImpact = currentImpact * weight;
            if (edgeImpact >= threshold) {
                const existingImpact = impactScores.get(dependentId) || 0;
                if (edgeImpact > existingImpact) {
                    impactScores.set(dependentId, edgeImpact);
                    queue.push(dependentId);
                }
            }
        }
        // Handle IMPORTS propagation: edges go from importer → imported,
        // so we need edges where this node's FILE is the import target
        if (!nodeId.includes("#") || impactScores.has(nodeId)) {
            const nodeFile = nodeId.includes("#") ? nodeId.split("#")[0] : nodeId;
            for (const edge of graph.edges) {
                if (edge.type !== "IMPORTS" || edge.to !== nodeFile)
                    continue;
                const importerId = edge.from;
                if (importerId === nodeId)
                    continue;
                const weight = edge.weight ?? EDGE_WEIGHTS.IMPORTS;
                const edgeImpact = currentImpact * weight;
                if (edgeImpact >= threshold) {
                    const existingImpact = impactScores.get(importerId) || 0;
                    if (edgeImpact > existingImpact) {
                        impactScores.set(importerId, edgeImpact);
                        queue.push(importerId);
                    }
                }
            }
        }
    }
    return impactScores;
}
