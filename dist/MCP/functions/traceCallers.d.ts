import { Graph } from "../../graph/Graph.js";
export declare function traceCallers(graph: Graph, functionName: string): {
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
//# sourceMappingURL=traceCallers.d.ts.map