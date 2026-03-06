import { Data } from "./data";
import { NodeType } from "./NodeType";

export type Node = {
    id: string;
    type: NodeType;
    data: Data;
}