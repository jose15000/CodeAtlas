import { addCodeChange, getChangesForFile, saveChangesGraph } from "../../graph/changes/changes.js";
export function saveCodeChange(changesGraph, dto) {
    const changeId = addCodeChange(changesGraph, dto);
    saveChangesGraph(changesGraph);
    return { changeId, file: dto.file, description: dto.description };
}
export function getFileHistory(changesGraph, nodeType, file) {
    return getChangesForFile(changesGraph, file, nodeType);
}
export function getAllChanges(changesGraph) {
    return Array.from(changesGraph.nodes.values())
        .filter(n => n.type === "code_change")
        .sort((a, b) => (a.data.timestamp?.getTime() || 0) - (b.data.timestamp?.getTime() || 0));
}
