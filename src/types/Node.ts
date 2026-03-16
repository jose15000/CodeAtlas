import { NodeMetadata } from "./NodeMetadata";
import { NodeType } from "./NodeType";

export type Node = {
    id: string;
    type: NodeType;
    metadata?: NodeMetadata;
    data: any;
}