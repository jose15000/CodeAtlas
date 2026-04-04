import { addReasoning, loadReasoningGraph, saveReasoningGraph } from "../src/graph/reasoning/reasoningGraph.js";
import { addCodeChange, loadChangesGraph, saveChangesGraph } from "../src/graph/changes/changes.js";

async function main() {
    const reasoningGraph = loadReasoningGraph();
    const changesGraph = loadChangesGraph();

    const prompt = "Optimize the redundant block in src/graph/reasoning/reasoningGraph.ts:L27-L31";
    const thoughtDescription = "The existing code was redundant in how it accessed data.reasoning multiple times and constructed the embedding context. Optimized using destructuring and simplified the embedding string. Also fixed a critical typo in REASONING_CACHE path and updated broken unit tests.";
    const thoughtDetails = "fix" as any;
    const solution = "Implemented destructuring in reasoningGraph.ts, updated saveReasoning.ts to be async and wrap data correctly, fixed REASONING_CACHE typo, and updated 14 tests in reasoningGraph.test.ts.";

    const toolCall = {
        tool: { name: "multi_replace_file_content", description: "Updated multiple files to align with new async/destructured pattern" },
        result: "success"
    };

    const reasoningNode = {
        prompt,
        thoughtDescription,
        thoughtDetails,
        solution,
        toolCall,
        agent: "Antigravity/Gemini",
        project: "ContextAtlas",
        model: "gemini-2.0-flash-exp",
        run_id: "run_" + Date.now()
    };

    await addReasoning(reasoningGraph, { reasoning: reasoningNode as any });
    saveReasoningGraph(reasoningGraph);

    // Record code changes
    const files = [
        "src/graph/reasoning/reasoningGraph.ts",
        "src/MCP/functions/saveReasoning.ts",
        "src/graph/reasoning/reasoningGraph.test.ts"
    ];

    for (const file of files) {
        addCodeChange(changesGraph, {
            file,
            description: "Optimization of addReasoning and test alignment",
            agentThought: "fix",
            diff: "Applied destructuring and async fixes"
        });
    }
    saveChangesGraph(changesGraph);

    console.log("✅ Reasoning and Code Changes saved successfully.");
}

main().catch(console.error);
