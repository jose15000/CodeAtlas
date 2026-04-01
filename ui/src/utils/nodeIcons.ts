import type { NodeType } from "../types";

export const node_icons: Record<NodeType, string> = {
    file: "📄",
    function: "⚡",
    method: "🔧",
    class: "🏗️",
    interface: "📐",
    import: "📥",
    exports: "📤",
    module: "📦",
    user_prompt: "💬",
    agent_thought: "🧠",
    tool_call: "🔌",
    tool_result: "✅",
    code_change: "✏️",
    implementation: "🚀",
    context_lookup: "🔍",
};