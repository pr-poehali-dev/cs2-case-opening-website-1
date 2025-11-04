import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem, InventoryContextType } from '@/types/inventory';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('cs2_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cs2_inventory', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<InventoryItem, 'id' | 'wonAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wonAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearInventory = () => {
    setItems([]);
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, removeItem, clearInventory }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
}
