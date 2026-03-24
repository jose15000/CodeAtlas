import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runClient() {
    const transport = new StdioClientTransport({
        command: "node",
        args: ["./dist/MCP/server.js"]
    });

    const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
    console.log("Connecting to MCP Server...");
    await client.connect(transport);
    console.log("Connected! Listing tools...");

    const { tools } = await client.listTools();
    console.log(`Found ${tools.length} tools:`);
    console.log(tools.map(t => " - " + t.name).join("\n"));

    async function callTestTool(name: string, args: any) {
        console.log(`\nTesting tool: ${name}`);
        try {
            const result = await client.callTool({ name, arguments: args });
            console.log(` => Success! Response snippet:`, JSON.stringify(result).substring(0, 100) + "...");
            return result;
        } catch (e: any) {
            console.error(` => Error calling ${name}:`, e.message);
        }
    }

    // 1. get_file
    await callTestTool("get_file", { path: "./package.json" });

    // 2. find_symbol
    await callTestTool("find_symbol", { symbol: "server" });

    // 3. search_symbol
    await callTestTool("search_symbol", { query: "search" });

    // 4. trace_callers (test with a known function like getFileHistory)
    await callTestTool("trace_callers", { functionName: "saveCodeChange" });

    // 5. save_code_change
    await callTestTool("save_code_change", {
        file: "dummy.txt",
        description: "Test run",
        agentThought: "test",
        diff: "no diff"
    });

    // 6. get_file_history
    await callTestTool("get_file_history", { file: "dummy.txt", nodeType: "code_change" });

    // 7. get_all_changes
    await callTestTool("get_all_changes", {});

    // 8. create_reasoning_context_graph
    await callTestTool("create_reasoning_context_graph", {
        prompt: "test", thought: "test thought", solution: "test solution", agent: "test agent", model: "test model", project: "test", run_id: "test"
    });

    // 9. expand_node (needs a valid node ID, let's use a dummy and expect it not to crash)
    await callTestTool("expand_node", { nodeId: "/fake.ts#Fake.method", depth: 1 });

    // 10. trace_callees
    await callTestTool("trace_callees", { nodeId: "/fake.ts#Fake.method" });

    console.log("\nFinished testing all tools.");
    process.exit(0);
}

runClient().catch(console.error);
