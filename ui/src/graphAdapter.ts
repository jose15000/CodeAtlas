import type { Node as RFNode, Edge as RFEdge } from "@xyflow/react";
import type { AtlasNode, AtlasEdge, NodeType, EdgeType } from "./types";

// ─── Node colors by type ─────────────────────────────────────────────────────
const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
    file:            { bg: "#1e293b", border: "#3b82f6", text: "#93c5fd" },
    function:        { bg: "#1a1a2e", border: "#8b5cf6", text: "#c4b5fd" },
    method:          { bg: "#1a1a2e", border: "#a78bfa", text: "#ddd6fe" },
    class:           { bg: "#1c1917", border: "#f59e0b", text: "#fcd34d" },
    interface:       { bg: "#1c1917", border: "#f97316", text: "#fdba74" },
    import:          { bg: "#0f172a", border: "#06b6d4", text: "#67e8f9" },
    exports:         { bg: "#0f172a", border: "#14b8a6", text: "#5eead4" },
    module:          { bg: "#1e293b", border: "#6366f1", text: "#a5b4fc" },
    user_prompt:     { bg: "#1e1b4b", border: "#818cf8", text: "#c7d2fe" },
    agent_thought:   { bg: "#312e81", border: "#a78bfa", text: "#ddd6fe" },
    tool_call:       { bg: "#172554", border: "#3b82f6", text: "#93c5fd" },
    tool_result:     { bg: "#0c4a6e", border: "#38bdf8", text: "#7dd3fc" },
    code_change:     { bg: "#14532d", border: "#22c55e", text: "#86efac" },
    implementation:  { bg: "#1e3a5f", border: "#60a5fa", text: "#bfdbfe" },
    context_lookup:  { bg: "#44403c", border: "#a8a29e", text: "#d6d3d1" },
};

const EDGE_COLORS: Record<EdgeType, string> = {
    IMPORTS:            "#3b82f6",
    EXPORTS:            "#14b8a6",
    CALLS:              "#8b5cf6",
    IMPLEMENTS:         "#f59e0b",
    DEFINES:            "#22c55e",
    GENERATED_BY:       "#f43f5e",
    THINKS:             "#a78bfa",
    CALLS_TOOL:         "#38bdf8",
    MODIFIES:           "#fb923c",
    FIXES:              "#4ade80",
    RELATED_TO_PROMPT:  "#818cf8",
};

// ─── Node icons (emoji) ──────────────────────────────────────────────────────
const NODE_ICONS: Record<NodeType, string> = {
    file: "📄",
    function: "⚡",
    method: "🔧",
    class: "🏗️",
    interface: "📐",
    import: "📥",
    exports: "📤",
    module: "📦",
    user_prompt: "💬",
    agent_thought: "🧠",
    tool_call: "🔌",
    tool_result: "✅",
    code_change: "✏️",
    implementation: "🚀",
    context_lookup: "🔍",
};

// ─── Label builder ───────────────────────────────────────────────────────────
function buildLabel(node: AtlasNode): string {
    const icon = NODE_ICONS[node.type] ?? "●";
    const name = node.data.name ?? node.data.file ?? node.id.split("/").pop() ?? node.id;
    return `${icon}  ${name}`;
}

// ─── Layout: simple force-directed-ish grid ──────────────────────────────────
function autoLayout(nodes: AtlasNode[]): Map<string, { x: number; y: number }> {
    const positions = new Map<string, { x: number; y: number }>();
    const typeGroups = new Map<string, AtlasNode[]>();

    // Group by type
    for (const n of nodes) {
        const list = typeGroups.get(n.type) ?? [];
        list.push(n);
        typeGroups.set(n.type, list);
    }

    let groupY = 0;
    const SPACING_X = 280;
    const SPACING_Y = 120;
    const COLS = 6;

    for (const [, group] of typeGroups) {
        for (let i = 0; i < group.length; i++) {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            positions.set(group[i].id, {
                x: col * SPACING_X + (Math.random() * 30 - 15),
                y: groupY + row * SPACING_Y + (Math.random() * 20 - 10),
            });
        }
        const rows = Math.ceil(group.length / COLS);
        groupY += rows * SPACING_Y + 100;
    }

    return positions;
}

// ─── Main converter ──────────────────────────────────────────────────────────
export function toReactFlowElements(
    atlasNodes: AtlasNode[],
    atlasEdges: AtlasEdge[]
): { nodes: RFNode[]; edges: RFEdge[] } {
    const positions = autoLayout(atlasNodes);
    const nodeIds = new Set(atlasNodes.map((n) => n.id));

    const nodes: RFNode[] = atlasNodes.map((n) => {
        const colors = NODE_COLORS[n.type] ?? { bg: "#1e293b", border: "#64748b", text: "#cbd5e1" };
        const pos = positions.get(n.id) ?? { x: 0, y: 0 };

        return {
            id: n.id,
            position: pos,
            data: { label: buildLabel(n) },
            style: {
                background: colors.bg,
                color: colors.text,
                border: `2px solid ${colors.border}`,
                borderRadius: "12px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'Inter', system-ui, sans-serif",
                boxShadow: `0 0 12px ${colors.border}44`,
                minWidth: "160px",
                textAlign: "center" as const,
            },
        };
    });

    const edges: RFEdge[] = atlasEdges
        .filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to))
        .map((e, i) => ({
            id: `e-${i}-${e.from}-${e.to}`,
            source: e.from,
            target: e.to,
            label: e.type,
            type: "smoothstep",
            animated: e.type === "CALLS" || e.type === "IMPORTS",
            style: {
                stroke: EDGE_COLORS[e.type] ?? "#475569",
                strokeWidth: 1.5,
            },
            labelStyle: {
                fontSize: "10px",
                fontWeight: 500,
                fill: EDGE_COLORS[e.type] ?? "#94a3b8",
            },
            labelBgStyle: {
                fill: "#0f172a",
                fillOpacity: 0.85,
            },
        }));

    return { nodes, edges };
}
