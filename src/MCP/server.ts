#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import fs from "fs"
import path from "path"
import { buildContextGraph } from "../index.js";

const graph = buildContextGraph(process.cwd());


const server = new McpServer({
    name: "CodeAtlas",
    version: "1.0.0"
},
    {
        capabilities: {
            tools: {

            }
        }
    }
)

server.registerTool(
    "find_symbol",
    {
        description: "Find code entities by name",
        inputSchema: {
            symbol: z.string().describe("find_symbol(login)")
        }
    },
    async ({ symbol }) => {
        return {
            content: [{ type: "text", text: `${symbol}` }]
        }
    }
)

server.registerTool(
    "expand_node",
    {
        description: "Expand the graph around a node.",
        inputSchema: {
            nodeId: z.string().describe("node id"),
            depth: z.number()
        }
    },
    async ({ nodeId, depth }) => {
        return {
            content: [{ type: "text", text: `${nodeId}, ${depth}`, }]
        }
    }
)

server.registerTool(
    "get_file",
    {
        description: "Returns the text content of a specified file.",
        inputSchema: {
            path: z.string().describe("path to the file to read")
        }
    },
    async ({ path: filePath }) => {
        try {
            const absolutePath = path.resolve(process.cwd(), filePath);
            const content = fs.readFileSync(absolutePath, "utf-8");
            return {
                content: [{ type: "text", text: content }]
            }
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error reading file: ${String(error)}` }],
                isError: true
            }
        }
    }
)

server.registerTool(
    "trace_callers",
    {
        description: "Finds all functions that call the given function. Shows who depends on this.",
        inputSchema: {
            functionName: z.string().describe("Name of the function to trace callers for")
        }
    },
    async ({ functionName }) => {
        const targetNode = Array.from(graph.nodes.values()).find(n => n.type === "function" && n.data.name === functionName);

        if (!targetNode) {
            return {
                content: [{ type: "text", text: `Function '${functionName}' not found in the graph.` }],
                isError: true
            }
        }
        const callers = graph.edges.filter(e => e.type === "CALLS" && e.to === targetNode.id);
        const callerIds = Array.from(new Set(callers.map(e => e.from)));

        const output = callerIds.map(id => id.split('#').pop() + ` (${id})`).join("\n");

        return {
            content: [{ type: "text", text: output || "No callers found." }]
        }
    }
)

server.registerTool(
    "trace_callees",
    {
        description: "Finds all functions that are called by the given function. Shows what this depends on.",
        inputSchema: {
            nodeId: z.string().describe("Node ID of the function (e.g. file.ts#myFunc)")
        }
    },
    async ({ nodeId }) => {
        const callees = graph.edges.filter(e => e.type === "CALLS" && e.from === nodeId);
        const calleeIds = Array.from(new Set(callees.map(e => e.to)));

        const output = calleeIds.map(id => id.split('#').pop() + ` (${id})`).join("\n");

        return {
            content: [{ type: "text", text: output || "No callees found." }]
        }
    }
)

server.registerTool(
    "search_symbol",
    {
        description: "Search for code symbols by partial name.",
        inputSchema: {
            query: z.string().describe("Partial string query to search for")
        }
    },
    async ({ query }) => {
        const lowerQuery = query.toLowerCase();

        const matches = Array.from(graph.nodes.values()).filter(n => {
            const name = n.data?.name || n.id;
            return name.toLowerCase().includes(lowerQuery);
        });

        const limitedMatches = matches.slice(0, 50);

        const output = limitedMatches.map(n => {
            return `${n.data?.name || 'Unnamed'} (${n.type}) - ${n.id}`;
        }).join("\n");

        return {
            content: [{ type: "text", text: output || "No symbols matched the query." }]
        }
    }
)

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("CodeAtlas MCP Server running on stdio");
}

main().catch(console.error);