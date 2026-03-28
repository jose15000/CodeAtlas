import { Graph } from "../graph/Graph.js";
export declare function expandNode(graph: Graph, nodeId: string, depth: number): {
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
};
//# sourceMappingURL=expandNode.d.ts.map