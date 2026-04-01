// Types mirroring the backend graph models

export type NodeType =
    | "file"
    | "function"
    | "method"
    | "class"
    | "import"
    | "user_prompt"
    | "agent_thought"
    | "tool_call"
    | "tool_result"
    | "code_change"
    | "implementation"
    | "context_lookup"
    | "interface"
    | "module"
    | "exports";

export type EdgeType =
    | "IMPORTS"
    | "EXPORTS"
    | "CALLS"
    | "IMPLEMENTS"
    | "DEFINES"
    | "GENERATED_BY"
    | "THINKS"
    | "CALLS_TOOL"
    | "MODIFIES"
    | "FIXES"
    | "RELATED_TO_PROMPT";

export type GraphType = "Code" | "Reasoning" | "Changes";

export interface AtlasNodeData {
    file?: string;
    path?: string;
    name?: string;
    text?: string;
    timestamp?: string;
    description?: string;
    className?: string;
    methodName?: string;
    diff?: string;
}

export interface AtlasNode {
    id: string;
    graphType: GraphType;
    type: NodeType;
    data: AtlasNodeData;
}

export interface AtlasEdge {
    from: string;
    to: string;
    type: EdgeType;
}

export interface GraphPayload {
    nodes: AtlasNode[];
    edges: AtlasEdge[];
}
