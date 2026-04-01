import { TAB_CONFIG } from "../config";
import { useTabContext } from "../contexts/TabContext";

export function LoadingOverlay() {
  const { activeTab } = useTabContext();
  
  return (
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
  );
}

export function ErrorOverlay({ error }: { error: string }) {
  return (
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
  );
}
