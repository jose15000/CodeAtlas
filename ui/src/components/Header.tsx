import { type GraphTab, TAB_CONFIG } from "../config";
import { useTabContext } from "../contexts/TabContext";

interface HeaderProps {
  stats: { nodes: number; edges: number };
}

export function Header({ stats }: HeaderProps) {
  const { activeTab, setActiveTab } = useTabContext();

  return (
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

      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
        <span>🟢 {stats.nodes} nodes</span>
        <span>🔗 {stats.edges} edges</span>
      </div>
    </header>
  );
}
