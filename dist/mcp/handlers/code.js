import { traceCallers } from "../../services/code/traceCallers.js";
import { traceCallees } from "../../services/code/traceCallees.js";
import { getFile } from "../../services/code/getFile.js";
export const CodeHandlers = {
    handleTraceCallers: async (graph, functionName) => {
        try {
            const results = traceCallers(graph, functionName);
            const outputText = results.map((r) => {
                const lines = r.callers.map(n => `  - ${n.data?.name ?? n.id} [${n.type}] (${n.id})`);
                return `${r.target.id}:\n${lines.length ? lines.join("\n") : "  (no callers found)"}`;
            }).join("\n\n");
            return { content: [{ type: "text", text: outputText }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: error.message }],
                isError: true
            };
        }
    },
    handleTraceCallees: async (graph, nodeId) => {
        const callees = traceCallees(graph, nodeId);
        if (callees.length === 0) {
            return { content: [{ type: "text", text: "No callees found." }] };
        }
        const lines = callees.map((n) => `  - ${n.data?.name ?? n.id} [${n.type}] (${n.id})`);
        return { content: [{ type: "text", text: lines.join("\n") }] };
    },
    handleGetFile: async (filePath) => {
        try {
            const content = getFile(filePath);
            return { content: [{ type: "text", text: content }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: error.message }],
                isError: true
            };
        }
    }
};
