import { searchSymbol } from "../../services/search/searchSymbol.js";
import { findSymbol } from "../../services/search/findSymbol.js";
import { semanticSearch } from "../../services/search/semanticSearch.js";
function formatNodeList(nodes, formatLine, emptyMessage) {
    if (nodes.length === 0) {
        return { content: [{ type: "text", text: emptyMessage }] };
    }
    const output = nodes.map(formatLine).join("\n\n");
    return { content: [{ type: "text", text: output }] };
}
export const SearchHandlers = {
    handleSearchSymbol: async (graph, query) => {
        const matches = searchSymbol(graph, query);
        return formatNodeList(matches, n => `${n.data?.name || "Unnamed"} (${n.type}) — ${n.id}`, "No symbols matched the query.");
    },
    handleFindSymbol: async (graph, symbol) => {
        const matches = findSymbol(graph, symbol);
        return formatNodeList(matches, n => `[${n.type}] ${n.data?.name ?? n.id}\n  id:   ${n.id}\n  file: ${n.id.split("#")[0]}`, `No symbols found matching '${symbol}'.`);
    },
    handleSemanticSearch: async (graph, query, limit, threshold) => {
        const results = await semanticSearch({ query, graph, limit, threshold });
        return formatNodeList(results, r => `[${r.type}] ${r.data.name ?? r.id}\n  id:    ${r.id}\n  file:  ${r.id.split("#")[0]}\n  score: ${r.score.toFixed(4)}`, `No semantic results found for '${query}'.`);
    }
};
