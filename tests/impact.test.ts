import { describe, it } from "node:test";
import assert from "node:assert";
import { Graph } from "../src/core/graph/Graph.js";
import { measureCodeImpact } from "../src/graph/impact/index.js";

describe("Impact Analysis", () => {
    it("linear dependency impact", () => {
        const graph = new Graph();
        graph.addNode({ id: "A", type: "FUNCTION", data: {}, metadata: {} });
        graph.addNode({ id: "B", type: "FUNCTION", data: {}, metadata: {} });
        graph.addNode({ id: "C", type: "FUNCTION", data: {}, metadata: {} });

        // A -> B -> C (A depends on B, B depends on C)
        graph.addEdge({ from: "A", to: "B", type: "CALLS", weight: 0.8 });
        graph.addEdge({ from: "B", to: "C", type: "CALLS", weight: 0.5 });

        const impact = measureCodeImpact(graph, ["C"]);

        assert.strictEqual(impact.get("C"), 1.0);
        assert.strictEqual(impact.get("B"), 0.5);
        assert.strictEqual(impact.get("A"), 0.4); // 0.5 * 0.8
    });

    it("multiple paths to same impact", () => {
        const graph = new Graph();
        graph.addNode({ id: "A", type: "FUNCTION", data: {}, metadata: {} });
        graph.addNode({ id: "B", type: "FUNCTION", data: {}, metadata: {} });
        graph.addNode({ id: "C", type: "FUNCTION", data: {}, metadata: {} });

        // A -> C (weight 0.2)
        // A -> B -> C (weight 0.8 * 0.5 = 0.4)
        graph.addEdge({ from: "A", to: "C", type: "CALLS", weight: 0.2 });
        graph.addEdge({ from: "A", to: "B", type: "CALLS", weight: 0.8 });
        graph.addEdge({ from: "B", to: "C", type: "CALLS", weight: 0.5 });

        const impact = measureCodeImpact(graph, ["C"]);

        assert.strictEqual(impact.get("C"), 1.0);
        assert.strictEqual(impact.get("B"), 0.5);
        assert.strictEqual(impact.get("A"), 0.4); // Should take the maximum path
    });

    it("circular dependency safety", () => {
        const graph = new Graph();
        graph.addNode({ id: "A", type: "FUNCTION", data: {}, metadata: {} });
        graph.addNode({ id: "B", type: "FUNCTION", data: {}, metadata: {} });

        // A <-> B
        graph.addEdge({ from: "A", to: "B", type: "CALLS", weight: 0.5 });
        graph.addEdge({ from: "B", to: "A", type: "CALLS", weight: 0.5 });

        const impact = measureCodeImpact(graph, ["A"]);

        assert.strictEqual(impact.get("A"), 1.0);
        assert.strictEqual(impact.get("B"), 0.5);
    });

    it("threshold stopping", () => {
        const graph = new Graph();
        graph.addNode({ id: "A", type: "FUNCTION", data: {}, metadata: {} });
        graph.addNode({ id: "B", type: "FUNCTION", data: {}, metadata: {} });

        graph.addEdge({ from: "A", to: "B", type: "CALLS", weight: 0.005 });

        const impact = measureCodeImpact(graph, ["B"], 0.01);

        assert.strictEqual(impact.get("B"), 1.0);
        assert.strictEqual(impact.has("A"), false); // 0.005 < 0.01
    });
});
