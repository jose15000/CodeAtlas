import type { Node as RFNode, Edge as RFEdge } from "@xyflow/react";
import type { AtlasNode, AtlasEdge } from "./types";
import { edge_colors, node_colors } from "./utils/colors";
import { node_icons } from "./utils/nodeIcons";

// ─── Node icons (emoji) ──────────────────────────────────────────────────────


// ─── Label builder ───────────────────────────────────────────────────────────
function buildLabel(node: AtlasNode): string {
    const icon = node_icons[node.type] ?? "●";
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
        const colors = node_colors[n.type] ?? { bg: "#1e293b", border: "#64748b", text: "#cbd5e1" };
        const pos = positions.get(n.id) ?? { x: 0, y: 0 };

        return {
            id: n.id,
            position: pos,
            data: { label: buildLabel(n) },
            style: {
                background: colors.bg,
                color: colors.text,
                border: `20px ${colors.border}`,
                borderRadius: "40px",
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
                stroke: edge_colors[e.type] ?? "#475569",
                strokeWidth: 1.5,
            },
            labelStyle: {
                fontSize: "10px",
                fontWeight: 500,
                fill: edge_colors[e.type] ?? "#94a3b8",
            },
            labelBgStyle: {
                fill: "#0f172a",
                fillOpacity: 0.85,
            },
        }));

    return { nodes, edges };
}
