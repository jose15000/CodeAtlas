import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";

async function main() {
    console.log("Iniciando MCP Client de Teste...");

    // 1. Configurar o Transport para rodar nosso próprio servidor compilado
    // Usamos path.resolve para garantir o caminho absoluto correto independente de onde rodarmos
    const serverPath = path.resolve(process.cwd(), "dist/MCP/server.js");

    const transport = new StdioClientTransport({
        command: "node",
        args: [serverPath] // Roda o servidor isoladamente
    });

    // 2. Criar o Cliente
    const client = new Client(
        {
            name: "test-client",
            version: "1.0.0",
        },
        {
            capabilities: {},
        }
    );

    console.log(`Conectando ao servidor em: ${serverPath}`);
    await client.connect(transport);
    console.log("✅ Conectado com sucesso!\n");

    // ==========================================
    // 3. Testar as Ferramentas
    // ==========================================

    try {
        // A. Listar tools
        console.log("--- Listando Ferramentas ---");
        const { tools } = await client.listTools();
        console.log("Tools disponíveis:", tools.map(t => t.name).join(", "));
        console.log("----------------------------\n");

        // B. Testar a busca de símbolo (search_symbol)
        console.log("--- Testando 'search_symbol' ---");
        console.log("Buscando por: 'buildContextGraph'");
        const searchResult = await client.callTool({
            name: "search_symbol",
            arguments: {
                query: "buildContextGraph"
            }
        });

        // As ferramentas retornam um array 'content' com os resultados
        if (Array.isArray(searchResult.content) && searchResult.content.length > 0) {
            console.log("Resultado:\n", (searchResult.content[0] as { text?: string }).text);
        } else {
            console.log("Nenhum conteúdo retornado.");
        }
        console.log("----------------------------\n");

        // C. Testar leitura de arquivo (get_file)
        console.log("--- Testando 'get_file' ---");
        console.log("Lendo arquivo: package.json");
        const fileResult = await client.callTool({
            name: "get_file",
            arguments: {
                path: "./package.json"
            }
        });

        if (Array.isArray(fileResult.content) && fileResult.content.length > 0) {
            const fileContent = (fileResult.content[0] as { text?: string }).text || "";
            console.log("Resultado (primeiros 150 caracteres):\n", fileContent.substring(0, 150) + "...");
        }
        console.log("\n----------------------------");

        // D. Testar create_reasoning_context_graph
        console.log("--- Testando 'create_reasoning_context_graph' ---");
        console.log("Criando um nó de reasoning...");
        const reasoningResult = await client.callTool({
            name: "create_reasoning_context_graph",
            arguments: {
                prompt: "Gerar um reasoning graph via teste MCP",
                thoughtDescription: "Preciso chamar a ferramenta create_reasoning_context_graph passando os parâmetros.",
                thoughtDetails: "test",
                solution: "Ferramenta chamada com sucesso.",
                toolCall: {
                    tool: { name: "create_reasoning_context_graph", description: "Teste de integração MCP" },
                    result: "success"
                },
                agent: "test-agent",
                model: "gpt-4",
                project: "code-atlas-test",
                run_id: "run_test_01"
            }
        });
        console.log("Resultado:\n", reasoningResult);
        console.log("\n----------------------------");

    } catch (error) {
        console.error("Erro ao testar ferramentas:", error);
    } finally {
        // 4. Fechar conexão
        console.log("\nEncerrando o cliente...");
        await client.close();
        process.exit(0);
    }
}

main().catch(console.error);
