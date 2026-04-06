import fs from "fs";
import path from "path";
import { Graph } from "../core/graph/Graph.js";
import type { Node } from "../core/graph/models/Node.js";
import type { Edge } from "../core/graph/models/Edge.js";

interface SerializedGraph {
    nodes: Node[];
    edges: Edge[];
    mtimes?: Record<string, number>;
}

export function saveGraph(graph: Graph, filePath: string, mtimes?: Record<string, number>): void {
    const data: SerializedGraph = {
        nodes: Array.from(graph.nodes.values()),
        edges: graph.edges,
        mtimes
    };
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function loadGraph(filePath: string): Graph | null {
    const result = loadGraphWithMtimes(filePath);
    return result ? result.graph : null;
}

export function loadGraphWithMtimes(filePath: string): { graph: Graph, mtimes: Record<string, number> } | null {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const data: SerializedGraph = JSON.parse(raw);

        const graph = new Graph();
        for (const node of data.nodes) {
            graph.addNode(node);
        }
        for (const edge of data.edges) {
            graph.addEdge(edge);
        }
        return { graph, mtimes: data.mtimes || {} };
    } catch {
        return null;
    }
}

interface PendingSave {
    graph: Graph;
    mtimes?: Record<string, number>;
    timer: NodeJS.Timeout;
}

const pendingSaves = new Map<string, PendingSave>();

export function debounceSaveGraph(graph: Graph, filePath: string, mtimes?: Record<string, number>, delayMs = 3000): void {
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

export function flushAllSaves(): void {
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
