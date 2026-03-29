import { Graph } from "../../core/graph/Graph.js";
export declare const SearchHandlers: {
    handleSearchSymbol: (graph: Graph, query: string) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleFindSymbol: (graph: Graph, symbol: string) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
    handleSemanticSearch: (graph: Graph, query: string, limit: number, threshold: number) => Promise<{
        content: {
            type: "text";
            text: string;
        }[];
    }>;
};
//# sourceMappingURL=search.d.ts.map