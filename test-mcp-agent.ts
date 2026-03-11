import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

const serverPath = path.resolve(process.cwd(), "dist/src/MCP/server.js");

const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath]
});

const client = new Client({ name: "agent-test", version: "1.0.0" }, { capabilities: {} });

function text(result: any): string {
    return (result?.content?.[0] as any)?.text ?? "(sem resposta)";
}

function section(title: string) {
    console.log(`\n${"─".repeat(60)}`);
    console.log(`  ${title}`);
    console.log("─".repeat(60));
}

async function main() {
    console.log("Conectando ao servidor MCP...");
    await client.connect(transport);
    console.log("✅ Conectado!\n");

    // ── 1. Lista de tools disponíveis ──────────────────────────────
    section("1. Tools disponíveis");
    const { tools } = await client.listTools();
    for (const t of tools) {
        console.log(`  • ${t.name}: ${t.description}`);
    }

    // ── 2. Salva o contexto desta conversa no reasoning graph ──────
    section("2. create_reasoning_context_graph");
    const r1 = await client.callTool({
        name: "create_reasoning_context_graph",
        arguments: {
            prompt: "Quero testar o grafo de reasoning usando os poderes do agente diretamente via MCP",
            thought: `Identifiquei que o servidor MCP expõe a tool 'create_reasoning_context_graph'.
Em vez de rodar um script avulso, conectei via StdioClientTransport ao servidor compilado
e chamei a tool de agente como um cliente MCP real. Isso é o uso correto do sistema —
o agente se registra como consumidor das próprias ferramentas que construiu.`,
            solution: `Construí 'test-mcp-agent.ts' que:
1. Conecta ao servidor MCP via StdioClientTransport
2. Lista todas as tools disponíveis
3. Chama create_reasoning_context_graph com o contexto real desta sessão
4. Busca símbolo 'expandGraph' via find_symbol para validar o grafo de código
5. Rastreia callees de expandGraph via trace_callees
6. Salva um code change registrando a correção do bug do BFS`
        }
    });
    console.log(text(r1));

    // ── 3. find_symbol — busca um símbolo no grafo de código ───────
    section("3. find_symbol: 'expandGraph'");
    const r2 = await client.callTool({
        name: "find_symbol",
        arguments: { symbol: "expandGraph" }
    });
    console.log(text(r2));

    // ── 4. search_symbol — busca parcial ───────────────────────────
    section("4. search_symbol: 'addReasoning'");
    const r3 = await client.callTool({
        name: "search_symbol",
        arguments: { query: "addReasoning" }
    });
    console.log(text(r3));

    // ── 5. expand_node — expande vizinhos do nó expandGraph ────────
    section("5. expand_node: expandGraph com depth=1");
    // O find_symbol retorna linhas como "  id:   /path/file.ts#Symbol"
    const expandGraphId = text(r2).split("\n")
        .find(l => l.trimStart().startsWith("id:") && l.includes("#"))
        ?.replace(/.*id:\s*/, "").trim();
    if (expandGraphId) {
        const r4 = await client.callTool({
            name: "expand_node",
            arguments: { nodeId: expandGraphId, depth: 1 }
        });
        console.log(text(r4).slice(0, 600) + "\n...");
    } else {
        console.log("(não foi possível extrair nodeId)");
    }

    // ── 6. save_code_change — registra a correção do bug do BFS ────
    section("6. save_code_change: bug fix no expandGraph");
    const r5 = await client.callTool({
        name: "save_code_change",
        arguments: {
            file: "src/expansion/expandGraph.ts",
            description: "Corrigido bug: condição de profundidade invertida. 'level > depth' → 'level < depth'. O BFS nunca atravessava além do nó inicial.",
            diff: `-            if (level > depth) {\n+            if (level < depth) {`
        }
    });
    console.log(text(r5));

    // ── 7. get_file_history — histórico do arquivo corrigido ───────
    section("7. get_file_history: src/expansion/expandGraph.ts");
    const r6 = await client.callTool({
        name: "get_file_history",
        arguments: { file: "src/expansion/expandGraph.ts" }
    });
    console.log(text(r6));

    // ── 8. get_all_changes — visão geral de tudo que foi alterado ──
    section("8. get_all_changes");
    const r7 = await client.callTool({
        name: "get_all_changes",
        arguments: {}
    });
    console.log(text(r7));

    await client.close();
    console.log("\n✅ Todas as tools testadas com sucesso!");
    process.exit(0);
}

main().catch((e) => {
    console.error("Erro:", e);
    process.exit(1);
});
