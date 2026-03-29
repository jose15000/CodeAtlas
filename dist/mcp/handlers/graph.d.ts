import { Graph } from "../../core/graph/Graph.js";
export declare const GraphHandlers: {
    handleExpandNode: (graph: Graph, nodeId: string, depth: number) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: "text";
            text: any;
        }[];
        isError: boolean;
    }>;
};
//# sourceMappingURL=graph.d.ts.map