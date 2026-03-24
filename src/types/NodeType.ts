import { AgentThought } from "./AgentThought";

export type NodeType =
    | "file"
    | "function"
    | "method"
    | "class"
    | "import"
    | "user_prompt"
    | "agent_thought"
    | AgentThought
    | "tool_call"
    | "tool_result"
    | "code_change"
    | "implementation"
    | "context_lookup"
    | "interface"
    | "module"
    | "exports";
