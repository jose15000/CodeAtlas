import { Edge } from "../types/Edge.js";
import { Node } from "../types/Node.js";
export declare class Graph {
    nodes: Map<string, Node>;
    edges: Edge[];
    addNode(node: Node): void;
    addEdge(edge: Edge): void;
    getNode(id: string): Node | undefined;
    getEdgesFrom(id: string): Edge[];
}
//# sourceMappingURL=Graph.d.ts.map