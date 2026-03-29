import { Graph } from "../../core/graph/Graph.js";
import { NodeType } from "../../core/graph/models/NodeType.js";
import { SaveCodeChangeRequestDTO } from "../../core/dtos/changes.dto.js";
export declare function saveCodeChange(changesGraph: Graph, dto: SaveCodeChangeRequestDTO): {
    changeId: string;
    file: string;
    description: string;
};
export declare function getFileHistory(changesGraph: Graph, nodeType: NodeType, file: string): import("../../core/graph/models/Node.js").Node[];
export declare function getAllChanges(changesGraph: Graph): import("../../core/graph/models/Node.js").Node[];
//# sourceMappingURL=codeChanges.d.ts.map