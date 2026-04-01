import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Node as RFNode,
  type Edge as RFEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { fetchCodeGraph, fetchReasoningGraph, fetchChangesGraph } from './api';
import { toReactFlowElements } from './graphAdapter';
import type { AtlasNode, AtlasEdge } from './types';

type GraphTab = 'code' | 'reasoning' | 'changes';

const TAB_CONFIG: Record<GraphTab, { label: string; icon: string; fetcher: () => Promise<{ nodes: AtlasNode[]; edges: AtlasEdge[] }> }> = {
  code:      { label: 'Code Graph',      icon: '🧬', fetcher: fetchCodeGraph },
  reasoning: { label: 'Reasoning Graph', icon: '🧠', fetcher: fetchReasoningGraph },
  changes:   { label: 'Changes Graph',   icon: '📝', fetcher: fetchChangesGraph },
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge>([]);
  const [activeTab, setActiveTab] = useState<GraphTab>('code');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ nodes: 0, edges: 0 });

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    TAB_CONFIG[activeTab].fetcher()
      .then((data) => {
        if (cancelled) return;
        const { nodes: rfNodes, edges: rfEdges } = toReactFlowElements(data.nodes, data.edges);
        setNodes(rfNodes);
        setEdges(rfEdges);
        setStats({ nodes: data.nodes.length, edges: data.edges.length });
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activeTab, setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column' }}>
      {/* ─── Header ─────────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderBottom: '1px solid #1e293b',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🌐</span>
          <h1 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}>
            ContextAtlas Viewer
          </h1>
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', gap: '4px' }}>
          {(Object.keys(TAB_CONFIG) as GraphTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: 'all 0.2s ease',
                background: activeTab === tab
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                  : 'transparent',
                color: activeTab === tab ? '#fff' : '#94a3b8',
                boxShadow: activeTab === tab ? '0 0 20px #3b82f644' : 'none',
              }}
            >
              {TAB_CONFIG[tab].icon} {TAB_CONFIG[tab].label}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
          <span>🟢 {stats.nodes} nodes</span>
          <span>🔗 {stats.edges} edges</span>
        </div>
      </header>

      {/* ─── Canvas ─────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            background: '#0a0e1acc',
            color: '#94a3b8',
            fontSize: '16px',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>⚙️</div>
              Loading {TAB_CONFIG[activeTab].label}...
            </div>
          </div>
        )}

        {error && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            background: '#0a0e1acc',
            color: '#f87171',
            fontSize: '14px',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            <div style={{
              textAlign: 'center',
              padding: '32px',
              background: '#1e293b',
              borderRadius: '16px',
              border: '1px solid #7f1d1d',
              maxWidth: '480px',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠️</div>
              <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Failed to load graph</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>{error}</p>
              <p style={{ margin: '16px 0 0', color: '#64748b', fontSize: '11px' }}>
                Make sure the API server is running: <code style={{ color: '#60a5fa' }}>bun src/ui.ts</code>
              </p>
            </div>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.1}
          maxZoom={3}
          style={{ background: '#0a0e1a' }}
          proOptions={{ hideAttribution: true }}
        >
          <Controls
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              border: '1px solid #334155',
              boxShadow: '0 4px 24px #00000066',
            }}
          />
          <MiniMap
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
            }}
            nodeColor={(n) => {
              const style = n.style as Record<string, string> | undefined;
              return style?.border?.replace('2px solid ', '') ?? '#475569';
            }}
            maskColor="#0a0e1a88"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#1e293b"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
