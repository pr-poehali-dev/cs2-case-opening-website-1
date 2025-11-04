import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UpgradeHistoryItem {
  id: string;
  timestamp: number;
  inputItems: Array<{
    name: string;
    rarity: string;
    price: number;
    icon: string;
  }>;
  targetItem: {
    name: string;
    rarity: string;
    price: number;
    icon: string;
  };
  betAmount: number;
  totalValue: number;
  chance: number;
  result: 'win' | 'lose';
}

interface UpgradeHistoryContextType {
  history: UpgradeHistoryItem[];
  addHistoryItem: (item: Omit<UpgradeHistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const UpgradeHistoryContext = createContext<UpgradeHistoryContextType | undefined>(undefined);

export function UpgradeHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<UpgradeHistoryItem[]>(() => {
    const saved = localStorage.getItem('cs2_upgrade_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cs2_upgrade_history', JSON.stringify(history));
  }, [history]);

  const addHistoryItem = (item: Omit<UpgradeHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: UpgradeHistoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <UpgradeHistoryContext.Provider value={{ history, addHistoryItem, clearHistory }}>
      {children}
    </UpgradeHistoryContext.Provider>
  );
}

export function useUpgradeHistory() {
  const context = useContext(UpgradeHistoryContext);
  if (!context) {
    throw new Error('useUpgradeHistory must be used within UpgradeHistoryProvider');
  }
  return context;
}
