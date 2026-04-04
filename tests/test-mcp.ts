import { buildContextGraph } from "../src/index.js";
import fs from "fs";
import path from "path";

const graph = buildContextGraph(process.cwd());

console.log("=== Testing search_symbol('Graph') ===");
const query = "graph".toLowerCase();
const matches = Array.from(graph.nodes.values()).filter(n => {
    const name = n.data?.name || n.id;
    return name.toLowerCase().includes(query);
});
console.log(matches.map(n => `${n.data?.name || 'Unnamed'} (${n.type})`).join("\n"));

console.log("\n=== Testing trace_callees('buildContextGraph') ===");
const fnNode = Array.from(graph.nodes.values()).find(n => n.type === "function" && n.data?.name === "buildContextGraph");
const callees = graph.edges.filter(e => e.type === "CALLS" && e.from === fnNode?.id);
console.log(callees.map(e => e.to).join("\n"));

console.log("\n=== Testing get_file ===");
console.log(fs.readFileSync(path.resolve(process.cwd(), "src/index.ts"), "utf-8").trim());
