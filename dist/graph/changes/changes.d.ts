import { Graph } from "../Graph.js";
import { NodeType } from "../../types/NodeType.js";
import { AgentThought } from "../../types/AgentThought.js";
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
export declare function getChangesForFile(file: string, nodeType: NodeType): import("../../types/Node.js").Node[];
//# sourceMappingURL=changes.d.ts.map