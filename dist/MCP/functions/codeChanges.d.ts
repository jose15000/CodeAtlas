import { Graph } from "../../graph/Graph.js";
import { AgentThought } from "../../types/AgentThought.js";
import { NodeType } from "../../types/NodeType.js";
export declare function saveCodeChange(changesGraph: Graph, file: string, agentThought: AgentThought, description: string, diff?: string, thoughtId?: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function getFileHistory(nodeType: NodeType, file: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function getAllChanges(changesGraph: Graph): {
    content: {
        type: "text";
        text: string;
    }[];
};
//# sourceMappingURL=codeChanges.d.ts.map