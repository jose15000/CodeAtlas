import { addReasoning, loadReasoningGraph, saveReasoningGraph } from "./src/graph/reasoning/reasoningGraph";

const graph = loadReasoningGraph();

addReasoning(
    graph,
    "Escrever testes unitários para todas as funcionalidades do CodeAtlas e reorganizar os arquivos de teste co-localizados",
    `Plano adotado:
1. Usar bun:test (runtime nativo Bun, sem dependência extra).
2. Co-localizar cada .test.ts ao lado do seu arquivo-fonte, seguindo o padrão já adotado por Graph.test.ts e persistence.test.ts.
3. Isolar I/O com fs.mkdtempSync + spy em process.cwd() para testes que escrevem disco.
4. Usar ts-morph com useInMemoryFileSystem para testar os extractors AST sem precisar de um projeto real.
5. Bug encontrado: expandGraph.ts linha 25 — condição 'level > depth' estava invertida, causando BFS nunca atravessar. Corrigido para 'level < depth'.
6. API real do reasoningGraph.ts: addReasoning recebe graph como 1º parâmetro; load/save são funções separadas (loadReasoningGraph / saveReasoningGraph).`,
    `Entregáveis:
- src/graph/Graph.test.ts → 9 testes (addNode, getNode, addEdge, getEdgesFrom)
- src/graph/persistence.test.ts → 9 testes (saveGraph, loadGraph, round-trip, JSON corrompido)
- src/graph/reasoning/reasoningGraph.test.ts → 12 testes atualizados para a API real
- src/expansion/expandGraph.test.ts → 8 testes de BFS com controle de profundidade e ciclos
- session/session.test.ts → 15 testes (addPrompt, addThought, addToolCall, addCodeChange + integração)
- src/indexer/indexer.test.ts → 6 testes do file-walker recursivo
- src/indexer/extractors/extractors.test.ts → 19 testes de AST (interfaces, funções, classes, imports)
Total: 68 testes, 0 falhas.
Bug corrigido em src/expansion/expandGraph.ts (level > depth → level < depth).`
);

saveReasoningGraph(graph);

console.log("✅ Contexto da conversa salvo no grafo de reasoning.");
console.log(`   Nós totais: ${graph.nodes.size}`);
console.log(`   Arestas totais: ${graph.edges.length}`);

const nodes = Array.from(graph.nodes.values());
const last3 = nodes.slice(-3);
console.log("\nÚltimas 3 entradas:");
for (const n of last3) {
    const preview = (n.data.text as string)?.slice(0, 100);
    console.log(`  [${n.type}] ${preview}...`);
}
