import { Graph } from "../../graph/Graph.js";
export declare function saveCodeChange(changesGraph: Graph, file: string, description: string, diff?: string, thoughtId?: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function getFileHistory(changesGraph: Graph, file: string): {
    content: {
        type: "text";
        text: string;
    }[];
};
export declare function getAllChanges(changesGraph: Graph): {
    content: {
        type: "text";
        text: string;
    }[];
};
//# sourceMappingURL=codeChanges.d.ts.map