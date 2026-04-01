import type { GraphPayload } from "./types";

const BASE = "/api/graphs";

export async function fetchCodeGraph(): Promise<GraphPayload> {
    const res = await fetch(`${BASE}/code`);
    if (!res.ok) throw new Error(`Failed to fetch code graph: ${res.status}`);
    return res.json();
}

export async function fetchReasoningGraph(): Promise<GraphPayload> {
    const res = await fetch(`${BASE}/reasoning`);
    if (!res.ok) throw new Error(`Failed to fetch reasoning graph: ${res.status}`);
    return res.json();
}

export async function fetchChangesGraph(): Promise<GraphPayload> {
    const res = await fetch(`${BASE}/changes`);
    if (!res.ok) throw new Error(`Failed to fetch changes graph: ${res.status}`);
    return res.json();
}
