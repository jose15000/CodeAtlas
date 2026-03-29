import { Graph } from "../../core/graph/Graph.js";
export declare const CodeHandlers: {
    handleTraceCallers: (graph: Graph, functionName: string) => Promise<{
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
    handleTraceCallees: (graph: Graph, nodeId: string) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleGetFile: (filePath: string) => Promise<{
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
//# sourceMappingURL=code.d.ts.map