import fs from "fs";
import path from "path";
import { buildContextGraph, reindexFiles } from "../../indexer/astIndexer.js";
import { saveGraph, loadGraphWithMtimes } from "../../graph/persistence.js";
import { Graph } from "../../core/graph/Graph.js";

const EXCLUDED_DIRS = ["node_modules", "dist", ".next", ".cache", ".git", "ui"];

function getCurrentSourceFiles(dir: string): Record<string, number> {
    const files: Record<string, number> = {};
    function walk(current: string) {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                if (!EXCLUDED_DIRS.includes(entry.name)) walk(full);
            } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
                // Ignore .d.ts files
                if (!entry.name.endsWith(".d.ts")) {
                    files[full] = fs.statSync(full).mtimeMs;
                }
            }
        }
    }
    walk(dir);
    return files;
}

export async function loadOrBuildGraph(cachePath: string): Promise<Graph> {
    const currentFiles = getCurrentSourceFiles(process.cwd());
    const cachedData = loadGraphWithMtimes(cachePath);

    if (!cachedData) {
        console.error("[CodeAtlas] No cache found — building graph from source...");
        const graph = await buildContextGraph(process.cwd());
        saveGraph(graph, cachePath, currentFiles);
        console.error(`[CodeAtlas] Graph built and cached (${graph.nodes.size} nodes, ${graph.edges.length} edges)`);
        return graph;
    }

    const { graph, mtimes: cachedMtimes } = cachedData;
    
    const filesToUpdate: string[] = [];
    const filesToRemove: string[] = [];

    // Localiza arquivos que foram adicionados ou modificados
    for (const [file, mtime] of Object.entries(currentFiles)) {
        if (!cachedMtimes[file] || mtime > cachedMtimes[file]) {
            filesToUpdate.push(file);
        }
    }

    // Localiza arquivos que foram deletados
    for (const file of Object.keys(cachedMtimes)) {
        if (!currentFiles[file]) {
            filesToRemove.push(file);
        }
    }

    if (filesToUpdate.length === 0 && filesToRemove.length === 0) {
        console.error(`[CodeAtlas] Cache is up-to-date (${graph.nodes.size} nodes, ${graph.edges.length} edges)`);
        return graph;
    }

    console.error(`[CodeAtlas] Source files changed — removing ${filesToRemove.length}, updating ${filesToUpdate.length} files...`);

    const allChanges = [...filesToRemove, ...filesToUpdate];

    // Remove logicamente o sub-grafo (nós e arestas) atrelados a esses arquivos antigos
    for (const file of allChanges) {
        graph.removeSubGraphOfFile(file);
    }

    // Reindexa unicamente os arquivos que sofreram update/create
    if (filesToUpdate.length > 0) {
        await reindexFiles(graph, process.cwd(), filesToUpdate);
    }

    saveGraph(graph, cachePath, currentFiles);
    console.error(`[CodeAtlas] Graph updated incrementally (${graph.nodes.size} nodes, ${graph.edges.length} edges)`);
    return graph;
}
