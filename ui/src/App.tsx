import '@xyflow/react/dist/style.css';
import { TabProvider } from './contexts/TabContext';
import { GraphViewer } from './components/GraphViewer';

export default function App() {
  return (
    <TabProvider>
      <div style={{ width: '100vw', height: '100vh', background: '#0a0e1a', display: 'flex', flexDirection: 'column' }}>
        <GraphViewer />
      </div>
    </TabProvider>
  );
}
