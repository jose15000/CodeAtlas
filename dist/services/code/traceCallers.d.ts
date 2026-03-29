import { Graph } from "../../core/graph/Graph.js";
import { Node } from "../../core/graph/models/Node.js";
export interface TraceResult {
    target: Node;
    callers: Node[];
}
export declare function traceCallers(graph: Graph, functionName: string): TraceResult[];
//# sourceMappingURL=traceCallers.d.ts.map