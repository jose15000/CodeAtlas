/**
 * Test script: spawns the CodeAtlas MCP server via stdio and exercises its tools.
 * Run from CodeAtlas root: npx tsx tests/test-mcp-server.ts
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CODEATLAS_ROOT = path.resolve(__dirname, "..");
const SERVER_SCRIPT = path.join(CODEATLAS_ROOT, "dist", "MCP", "server.js");
// Run server with cwd = LioApply-client so cache is written inside workspace (writable)
const LIOAPPLY_CLIENT = path.resolve(CODEATLAS_ROOT, "..", "LioApply-client");

async function main() {
  console.log("Starting CodeAtlas MCP server (stdio)...");
  const transport = new StdioClientTransport({
    command: "node",
    args: [SERVER_SCRIPT],
    cwd: LIOAPPLY_CLIENT,
  });

  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log("Connected. Server:", client.getServerVersion());

  // 1) List tools
  console.log("\n--- list_tools ---");
  const { tools } = await client.listTools();
  console.log("Tools:", tools.length);
  tools.forEach((t) => console.log("  -", t.name, ":", t.description?.slice(0, 50) + "..."));

  // 2) get_file
  console.log("\n--- get_file (package.json) ---");
  const getFileResult = await client.callTool({
    name: "get_file",
    arguments: { path: path.join(LIOAPPLY_CLIENT, "package.json") },
  });
  const content = getFileResult.content?.[0];
  if (content && "text" in content) {
    console.log("First 300 chars:", content.text.slice(0, 300));
  } else {
    console.log("Result:", JSON.stringify(getFileResult, null, 2).slice(0, 500));
  }

  // 3) find_symbol
  console.log("\n--- find_symbol('graph') ---");
  const findResult = await client.callTool({
    name: "find_symbol",
    arguments: { symbol: "graph" },
  });
  const findContent = findResult.content?.[0];
  if (findContent && "text" in findContent) {
    console.log("Result:", findContent.text.slice(0, 600));
  } else {
    console.log("Result:", JSON.stringify(findResult, null, 2).slice(0, 500));
  }

  // 4) search_symbol
  console.log("\n--- search_symbol('load') ---");
  const searchResult = await client.callTool({
    name: "search_symbol",
    arguments: { query: "load" },
  });
  const searchContent = searchResult.content?.[0];
  if (searchContent && "text" in searchContent) {
    console.log("Result:", searchContent.text.slice(0, 400));
  } else {
    console.log("Result:", JSON.stringify(searchResult, null, 2).slice(0, 400));
  }

  transport.close();
  console.log("\nDone. All tools responded.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
