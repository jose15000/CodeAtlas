import { Graph } from "../../core/graph/Graph.js";
import { NodeType } from "../../core/graph/models/NodeType.js";
import { SaveReasoningRequestDTO } from "../../core/dtos/reasoning.dto.js";
import { SaveCodeChangeRequestDTO } from "../../core/dtos/changes.dto.js";
export declare const HistoryHandlers: {
    handleSaveReasoning: (graph: Graph, dto: SaveReasoningRequestDTO) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleGetBugsByFile: (graph: Graph, file: string) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleSaveCodeChange: (graph: Graph, dto: SaveCodeChangeRequestDTO) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleGetFileHistory: (graph: Graph, nodeType: NodeType, file: string) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleGetAllChanges: (graph: Graph) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
//# sourceMappingURL=history.d.ts.map