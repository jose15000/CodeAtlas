#!/usr/bin/env node
import { Elysia } from "elysia";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Resolve graph cache paths ───────────────────────────────────────────────
const CONTEXT_DIR = path.join(process.cwd(), "context");
const CODE_CACHE = path.join(CONTEXT_DIR, ".codeatlas-cache.json");
const REASONING_CACHE = path.join(CONTEXT_DIR, ".reasoning-cache.json");
const CHANGES_CACHE = path.join(CONTEXT_DIR, ".changes-cache.json");

function loadJsonSafe(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    } catch (e) {
        console.error(`[CodeAtlas UI] Failed to load ${filePath}:`, e);
    }
    return { nodes: [], edges: [] };
}

// ─── API + Static Server ─────────────────────────────────────────────────────
import { node } from "@elysiajs/node";

const distPublic = path.join(__dirname, "public");
const srcDistPublic = path.join(__dirname, "../dist/public");
const publicDir = fs.existsSync(distPublic) ? distPublic : srcDistPublic;
const hasPublicDir = fs.existsSync(publicDir);

const app = new Elysia({ adapter: node() })
    // ─── REST API endpoints ──────────────────────────────────────────────
    .get("/api/graphs/code", () => {
        const raw = loadJsonSafe(CODE_CACHE);
        // Strip embeddings to reduce payload size
        const nodes = raw.nodes.map((n: any) => ({
            ...n,
            data: { ...n.data, embedding: undefined }
        }));
        return { nodes, edges: raw.edges };
    })
    .get("/api/graphs/reasoning", () => loadJsonSafe(REASONING_CACHE))
    .get("/api/graphs/changes", () => loadJsonSafe(CHANGES_CACHE))
    .get("/api/graphs/all", () => ({
        code: loadJsonSafe(CODE_CACHE),
        reasoning: loadJsonSafe(REASONING_CACHE),
        changes: loadJsonSafe(CHANGES_CACHE),
    }));

// Static file serving (only in production build)
const mimeTypes: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
};

if (hasPublicDir) {
    app.get("*", ({ request, set }) => {
        const url = new URL(request.url);
        let pathname = url.pathname;
        if (pathname === "/") pathname = "/index.html";
        
        const filePath = path.join(publicDir, pathname);

        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            set.headers["Content-Type"] = mimeTypes[ext] || "text/plain";
            return new Response(fs.readFileSync(filePath), {
                headers: { "Content-Type": set.headers["Content-Type"] }
            });
        }

        // SPA Fallback
        const indexPath = path.join(publicDir, "index.html");
        return new Response(fs.readFileSync(indexPath, "utf8"), {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    });
}

app.listen(3333);

console.log(`[CodeAtlas UI] Server running at http://localhost:3333`);
console.log(`[CodeAtlas UI] API endpoints:`);
console.log(`  GET /api/graphs/code`);
console.log(`  GET /api/graphs/reasoning`);
console.log(`  GET /api/graphs/changes`);
if (hasPublicDir) {
    console.log(`[CodeAtlas UI] Serving frontend from ${publicDir}`);
} else {
    console.log(`[CodeAtlas UI] No frontend build found. Use Vite dev server (npm run dev:ui) for the UI.`);
}
