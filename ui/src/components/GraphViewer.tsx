import { useCallback, useEffect, useState } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node as RFNode,
  type Edge as RFEdge,
} from '@xyflow/react';

import { TAB_CONFIG } from '../config';
import { toReactFlowElements } from '../graphAdapter';
import { Header } from './Header';
import { LoadingOverlay, ErrorOverlay } from './Overlays';
import { GraphCanvas } from './GraphCanvas';
import { useTabContext } from '../contexts/TabContext';

export function GraphViewer() {
  const { activeTab } = useTabContext();
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge>([]);
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
    <>
      <Header stats={stats} />

      <div style={{ flex: 1, position: 'relative' }}>
        {loading && <LoadingOverlay />}
        {error && <ErrorOverlay error={error} />}

        <GraphCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>
    </>
  );
}
