import type { Edge } from "./models/Edge.js";
import type { Node } from "./models/Node.js";
export declare class Graph {
    nodes: Map<string, Node>;
    edges: Edge[];
    addNode(node: Node): void;
    addEdge(edge: Edge): void;
    getNode(id: string): Node | undefined;
    getEdgesFrom(id: string): Edge[];
    getEdgesTo(id: string): Edge[];
    removeSubGraphOfFile(filePath: string): void;
}
//# sourceMappingURL=Graph.d.ts.map