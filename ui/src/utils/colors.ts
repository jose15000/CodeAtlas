import type { EdgeType, NodeType } from "../types";

export const node_colors: Record<NodeType, { bg: string; border: string; text: string }> = {
    file: { bg: "#1e293b", border: "#3b82f6", text: "#93c5fd" },
    function: { bg: "#1a1a2e", border: "#8b5cf6", text: "#c4b5fd" },
    method: { bg: "#1a1a2e", border: "#a78bfa", text: "#ddd6fe" },
    class: { bg: "#1c1917", border: "#f59e0b", text: "#fcd34d" },
    interface: { bg: "#1c1917", border: "#f97316", text: "#fdba74" },
    import: { bg: "#0f172a", border: "#06b6d4", text: "#67e8f9" },
    exports: { bg: "#0f172a", border: "#14b8a6", text: "#5eead4" },
    module: { bg: "#1e293b", border: "#6366f1", text: "#a5b4fc" },
    user_prompt: { bg: "#1e1b4b", border: "#818cf8", text: "#c7d2fe" },
    agent_thought: { bg: "#312e81", border: "#a78bfa", text: "#ddd6fe" },
    tool_call: { bg: "#172554", border: "#3b82f6", text: "#93c5fd" },
    tool_result: { bg: "#0c4a6e", border: "#38bdf8", text: "#7dd3fc" },
    code_change: { bg: "#14532d", border: "#22c55e", text: "#86efac" },
    implementation: { bg: "#1e3a5f", border: "#60a5fa", text: "#bfdbfe" },
    context_lookup: { bg: "#44403c", border: "#a8a29e", text: "#d6d3d1" },
};


export const edge_colors: Record<EdgeType, string> = {
    IMPORTS: "#3b82f6",
    EXPORTS: "#14b8a6",
    CALLS: "#8b5cf6",
    IMPLEMENTS: "#f59e0b",
    DEFINES: "#22c55e",
    GENERATED_BY: "#f43f5e",
    THINKS: "#a78bfa",
    CALLS_TOOL: "#38bdf8",
    MODIFIES: "#fb923c",
    FIXES: "#4ade80",
    RELATED_TO_PROMPT: "#818cf8",
};