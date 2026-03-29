import { saveReasoning } from "../../services/history/saveReasoning.js";
import { getBugsByFile } from "../../services/history/getBugsByFile.js";
import { saveCodeChange, getFileHistory, getAllChanges } from "../../services/history/codeChanges.js";
function formatNodes(nodes, emptyMsg, formatter) {
    if (nodes.length === 0) {
        return { content: [{ type: "text", text: emptyMsg }] };
    }
    return { content: [{ type: "text", text: nodes.map(formatter).join("\n\n") }] };
}
export const HistoryHandlers = {
    handleSaveReasoning: async (graph, dto) => {
        const { size } = await saveReasoning(graph, dto);
        return { content: [{ type: "text", text: `Reasoning saved (${size} total entries in memory).` }] };
    },
    handleGetBugsByFile: async (graph, file) => {
        const bugs = getBugsByFile(graph, file);
        return formatNodes(bugs, `No bugs found in '${file}'.`, n => `Bug in ${n.data?.file}:\nThought: ${n.data?.reasoning?.thoughtDescription}\nSolution: ${n.data?.reasoning?.solution}`);
    },
    handleSaveCodeChange: async (graph, dto) => {
        const result = saveCodeChange(graph, dto);
        return {
            content: [{
                    type: "text",
                    text: `Code change recorded. Change ID: ${result.changeId}\n  File: ${result.file}\n  Description: ${result.description}`
                }]
        };
    },
    handleGetFileHistory: async (graph, nodeType, file) => {
        const changes = getFileHistory(graph, nodeType, file);
        return formatNodes(changes, `No recorded changes for: ${file}`, n => `[${n.data.timestamp?.toISOString() || "unknown"}] ${n.data.description}${n.data.diff ? `\n${n.data.diff}` : ""}`);
    },
    handleGetAllChanges: async (graph) => {
        const changes = getAllChanges(graph);
        return formatNodes(changes, "No code changes recorded yet.", n => `[${n.data.timestamp?.toISOString() || "unknown"}] ${n.data.file}\n  ${n.data.description}`);
    }
};
