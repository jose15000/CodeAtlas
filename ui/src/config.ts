import { fetchCodeGraph, fetchReasoningGraph, fetchChangesGraph } from './api';
import type { AtlasNode, AtlasEdge } from './types';

export type GraphTab = 'code' | 'reasoning' | 'changes';

export const TAB_CONFIG: Record<GraphTab, { label: string; icon: string; fetcher: () => Promise<{ nodes: AtlasNode[]; edges: AtlasEdge[] }> }> = {
  code:      { label: 'Code Graph',      icon: '🧬', fetcher: fetchCodeGraph },
  reasoning: { label: 'Reasoning Graph', icon: '🧠', fetcher: fetchReasoningGraph },
  changes:   { label: 'Changes Graph',   icon: '📝', fetcher: fetchChangesGraph },
};
