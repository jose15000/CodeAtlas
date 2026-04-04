/**
 * Salva contexto (prompt → thought → solution) no grafo de raciocínio do CodeAtlas
 * via a tool create_reasoning_context_graph do servidor MCP.
 *
 * Uso: npx tsx tests/save-context.ts [prompt] [thought] [solution]
 * Ou com variáveis de ambiente: PROMPT, THOUGHT, SOLUTION
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CODEATLAS_ROOT = path.resolve(__dirname, "..");
const SERVER_SCRIPT = path.join(CODEATLAS_ROOT, "dist", "MCP", "server.js");
const LIOAPPLY_CLIENT = path.resolve(CODEATLAS_ROOT, "..", "LioApply-client");

async function main() {
  const prompt =
    process.env.PROMPT ??
    process.argv[2] ??
    "Observar o projeto LioApply-client e sugerir correções";
  const thought =
    process.env.THOUGHT ??
    process.argv[3] ??
    "Analisei package.json, README, middleware, NextAuth, cvApi, checkout, schemas e layout. Identifiquei: ThemeProvider importado mas não usado; email sem validação .email() nos schemas; URLs hardcoded no checkout; BACKEND_URL sem guard; error: any no catch; React.ReactNode sem import; README com comando dev incorreto.";
  const solution =
    process.env.SOLUTION ??
    process.argv[4] ??
    "Aplicadas correções: layout.tsx passou a usar ThemeProvider envolvendo a app; auth.schema.ts ganhou .email() em login e signup; checkout route usa NEXT_PUBLIC_APP_URL e error unknown; cvApi usa getBackendUrl() com checagem; editcv/layout importa ReactNode; README atualizado para LioApply e pnpm start:dev. Sugestões deixadas: alinhar nome do package, matcher /dashboard, validação de env do NextAuth, .env.example.";

  const agent = process.env.AGENT ?? "cursor-gpt";
  const model = process.env.MODEL ?? "gpt-5.2";
  const project = process.env.PROJECT ?? "LioApply-client";
  const run_id = process.env.RUN_ID ?? `run_${Date.now()}`;

  console.log("Conectando ao CodeAtlas MCP (stdio)...");
  const transport = new StdioClientTransport({
    command: "node",
    args: [SERVER_SCRIPT],
    cwd: LIOAPPLY_CLIENT,
  });

  const client = new Client(
    { name: "save-context", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log("Conectado. Salvando contexto no reasoning graph...");

  const result = await client.callTool({
    name: "create_reasoning_context_graph",
    arguments: { prompt, thought, solution, agent, model, project, run_id },
  });

  const content = result.content?.[0];
  if (content && "text" in content) {
    console.log("Resposta:", content.text);
  } else {
    console.log("Result:", JSON.stringify(result, null, 2));
  }

  transport.close();
  console.log("Contexto armazenado.");
}

main().catch((err) => {
  console.error("Erro:", err);
  process.exit(1);
});
