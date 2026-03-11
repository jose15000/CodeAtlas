import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { Graph } from "../Graph.js";
import { addReasoning, loadReasoningGraph, saveReasoningGraph } from "./reasoningGraph.js";

// reasoningGraph.ts resolve o path do cache como:
//   path.join(process.cwd(), ".codeatlas-reasoning.json")
// Espiamos process.cwd() para apontar para um diretório temp — sem tocar arquivos reais.

let tmpDir: string;
let cwdSpy: ReturnType<typeof spyOn>;

const cacheName = ".codeatlas-reasoning.json";
function cachePath() { return path.join(tmpDir, cacheName); }

beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codeatlas-reasoning-test-"));
    cwdSpy = spyOn(process, "cwd").mockReturnValue(tmpDir);
});

afterEach(() => {
    cwdSpy.mockRestore();
    fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// loadReasoningGraph
// ---------------------------------------------------------------------------

describe("loadReasoningGraph", () => {
    it("retorna um Graph vazio quando não existe cache", () => {
        const graph = loadReasoningGraph();
        expect(graph.nodes.size).toBe(0);
        expect(graph.edges.length).toBe(0);
    });

    it("reidrata um grafo persistido corretamente", () => {
        const seed = {
            nodes: [{ id: "n1", type: "user_prompt", data: { text: "hello" } }],
            edges: [],
        };
        fs.writeFileSync(cachePath(), JSON.stringify(seed, null, 2), "utf-8");

        const graph = loadReasoningGraph();
        expect(graph.nodes.size).toBe(1);
        expect(graph.getNode("n1")?.data.text).toBe("hello");
    });

    it("retorna Graph vazio quando o arquivo está corrompido", () => {
        fs.writeFileSync(cachePath(), "INVALID_JSON", "utf-8");
        const graph = loadReasoningGraph();
        expect(graph.nodes.size).toBe(0);
    });
});

// ---------------------------------------------------------------------------
// saveReasoningGraph
// ---------------------------------------------------------------------------

describe("saveReasoningGraph", () => {
    it("cria o arquivo de cache em disco", () => {
        const g = new Graph();
        expect(fs.existsSync(cachePath())).toBe(false);
        saveReasoningGraph(g);
        expect(fs.existsSync(cachePath())).toBe(true);
    });

    it("round-trip: salva e carrega sem perda de dados", () => {
        const g = new Graph();
        g.addNode({ id: "n1", type: "user_prompt", data: { text: "oi" } });
        g.addEdge({ from: "n1", to: "n2", type: "THINKS" });

        saveReasoningGraph(g);

        const loaded = loadReasoningGraph();
        expect(loaded.nodes.size).toBe(1);
        expect(loaded.edges).toHaveLength(1);
        expect(loaded.getNode("n1")?.data.text).toBe("oi");
    });
});

// ---------------------------------------------------------------------------
// addReasoning
// ---------------------------------------------------------------------------

describe("addReasoning", () => {
    it("adiciona exatamente 3 nós e 2 arestas ao grafo", () => {
        const g = new Graph();
        addReasoning(g, "prompt", "thought", "solution");

        expect(g.nodes.size).toBe(3);
        expect(g.edges.length).toBe(2);
    });

    it("cria nós com os tipos corretos", () => {
        const g = new Graph();
        addReasoning(g, "p", "t", "s");

        const types = Array.from(g.nodes.values()).map((n) => n.type);
        expect(types).toContain("user_prompt");
        expect(types).toContain("agent_thought");
        expect(types).toContain("implementation");
    });

    it("armazena os textos corretos nos nós", () => {
        const g = new Graph();
        addReasoning(g, "meu prompt", "meu pensamento", "minha solução");

        const nodes = Array.from(g.nodes.values());
        expect(nodes.find((n) => n.type === "user_prompt")?.data.text).toBe("meu prompt");
        expect(nodes.find((n) => n.type === "agent_thought")?.data.text).toBe("meu pensamento");
        expect(nodes.find((n) => n.type === "implementation")?.data.text).toBe("minha solução");
    });

    it("conecta com arestas THINKS e GENERATED_BY na direção correta", () => {
        const g = new Graph();
        addReasoning(g, "p", "t", "s");

        const nodes = Array.from(g.nodes.values());
        const promptNode = nodes.find((n) => n.type === "user_prompt")!;
        const thoughtNode = nodes.find((n) => n.type === "agent_thought")!;
        const solutionNode = nodes.find((n) => n.type === "implementation")!;

        const thinksEdge = g.edges.find((e) => e.type === "THINKS");
        const generatedByEdge = g.edges.find((e) => e.type === "GENERATED_BY");

        expect(thinksEdge?.from).toBe(promptNode.id);
        expect(thinksEdge?.to).toBe(thoughtNode.id);
        expect(generatedByEdge?.from).toBe(thoughtNode.id);
        expect(generatedByEdge?.to).toBe(solutionNode.id);
    });

    it("cada nó tem um timestamp ISO válido", () => {
        const g = new Graph();
        addReasoning(g, "p", "t", "s");

        for (const node of g.nodes.values()) {
            const ts = node.data.timestamp as string;
            expect(ts).toBeDefined();
            expect(new Date(ts).toISOString()).toBe(ts);
        }
    });

    it("acumula múltiplas entradas no mesmo grafo", () => {
        const g = new Graph();
        addReasoning(g, "p1", "t1", "s1");
        addReasoning(g, "p2", "t2", "s2");

        expect(g.nodes.size).toBe(6);
        expect(g.edges.length).toBe(4);
    });

    it("gera IDs únicos a cada chamada", () => {
        const g = new Graph();
        addReasoning(g, "p1", "t1", "s1");
        addReasoning(g, "p2", "t2", "s2");

        const ids = Array.from(g.nodes.keys());
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("não persiste automaticamente — requer saveReasoningGraph", () => {
        const g = new Graph();
        addReasoning(g, "p", "t", "s");
        // Sem chamar saveReasoningGraph, o arquivo não deve existir
        expect(fs.existsSync(cachePath())).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// Fluxo completo: load → add → save → load
// ---------------------------------------------------------------------------

describe("fluxo completo de persistência", () => {
    it("persiste e recarrega entradas de reasoning corretamente", () => {
        // Sessão 1: adiciona e salva
        const g1 = loadReasoningGraph();
        addReasoning(g1, "Como funciona o BFS?", "O BFS usa uma fila e um Set de visitados", "Implementei expandGraph com BFS iterativo");
        saveReasoningGraph(g1);

        // Sessão 2: recarrega e verifica
        const g2 = loadReasoningGraph();
        expect(g2.nodes.size).toBe(3);
        const nodes = Array.from(g2.nodes.values());
        expect(nodes.find((n) => n.type === "user_prompt")?.data.text).toBe("Como funciona o BFS?");
    });
});
