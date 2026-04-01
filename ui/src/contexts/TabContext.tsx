import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GraphTab } from '../config';

interface TabContextType {
  activeTab: GraphTab;
  setActiveTab: (tab: GraphTab) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<GraphTab>('code');

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}
