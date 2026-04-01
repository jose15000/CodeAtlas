import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  type Node as RFNode,
  type Edge as RFEdge,
} from '@xyflow/react';

interface GraphCanvasProps {
  nodes: RFNode[];
  edges: RFEdge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
}

export function GraphCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: GraphCanvasProps) {
  return (
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
  );
}
