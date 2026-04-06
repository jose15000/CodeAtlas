import fs from "fs";
import path from "path";
import { Graph } from "../core/graph/Graph.js";
export function saveGraph(graph, filePath, mtimes) {
    const data = {
        nodes: Array.from(graph.nodes.values()),
        edges: graph.edges,
        mtimes
    };
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
export function loadGraph(filePath) {
    const result = loadGraphWithMtimes(filePath);
    return result ? result.graph : null;
}
export function loadGraphWithMtimes(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(raw);
        const graph = new Graph();
        for (const node of data.nodes) {
            graph.addNode(node);
        }
        for (const edge of data.edges) {
            graph.addEdge(edge);
        }
        return { graph, mtimes: data.mtimes || {} };
    }
    catch {
        return null;
    }
}
const pendingSaves = new Map();
export function debounceSaveGraph(graph, filePath, mtimes, delayMs = 3000) {
    const pending = pendingSaves.get(filePath);
    if (pending) {
        clearTimeout(pending.timer);
    }
    const timer = setTimeout(() => {
        saveGraph(graph, filePath, mtimes);
        pendingSaves.delete(filePath);
    }, delayMs);
    pendingSaves.set(filePath, { graph, mtimes, timer });
}
export function flushAllSaves() {
    for (const [filePath, pending] of pendingSaves.entries()) {
        clearTimeout(pending.timer);
        saveGraph(pending.graph, filePath, pending.mtimes);
    }
    pendingSaves.clear();
}
// Registra hooks para flush gracefull
process.on("SIGINT", () => {
    flushAllSaves();
    process.exit(0);
});
process.on("SIGTERM", () => {
    flushAllSaves();
    process.exit(0);
});
