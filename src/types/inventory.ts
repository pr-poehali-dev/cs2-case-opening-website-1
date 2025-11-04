export interface InventoryItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  caseName: string;
  wonAt: number;
  price: number;
}

export interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'wonAt'>) => void;
  removeItem: (id: string) => void;
  clearInventory: () => void;
}
