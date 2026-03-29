import { Graph } from "../../core/graph/Graph.js";
import { NodeType } from "../../core/graph/models/NodeType.js";
import { AgentThought } from "../../core/graph/models/AgentThought.js";
export interface CodeChangeEntry {
    file: string;
    description: string;
    agentThought: AgentThought;
    diff?: string;
    thoughtId?: string;
}
export declare function loadChangesGraph(): Graph;
export declare function saveChangesGraph(graph: Graph): void;
export declare function addCodeChange(graph: Graph, entry: CodeChangeEntry): string;
export declare function getChangesForFile(graph: Graph, file: string, nodeType: NodeType): import("../../core/graph/models/Node.js").Node[];
//# sourceMappingURL=changes.d.ts.map