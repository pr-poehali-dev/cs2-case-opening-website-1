import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SteamItem {
  id: number;
  display_name?: string;
  weapon_type?: string;
  image_url?: string;
  current_price?: number;
  rarity?: string;
}

interface UpgradeTarget {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  price: number;
}

interface UpgradeTargetManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTarget: (target: UpgradeTarget) => void;
}

const rarityColors = {
  common: 'from-gray-600 to-gray-800 border-gray-500',
  rare: 'from-blue-600 to-blue-800 border-blue-500',
  epic: 'from-purple-600 to-purple-800 border-purple-500',
  legendary: 'from-orange-600 to-orange-800 border-orange-500',
};

const rarityNames = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
};

export default function UpgradeTargetManager({ isOpen, onClose, onAddTarget }: UpgradeTargetManagerProps) {
  const [steamItems, setSteamItems] = useState<SteamItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SteamItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSteamItems();
    }
  }, [isOpen]);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedRarity, minPrice, maxPrice, steamItems]);

  const loadSteamItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/steam-items');
      if (response.ok) {
        const data = await response.json();
        setSteamItems(data.items || []);
      }
    } catch (error) {
      console.error('Error loading steam items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...steamItems];

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.weapon_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(item => item.rarity === selectedRarity);
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      filtered = filtered.filter(item => (item.current_price || 0) >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter(item => (item.current_price || 0) <= max);
    }

    filtered.sort((a, b) => (b.current_price || 0) - (a.current_price || 0));

    setFilteredItems(filtered);
  };

  const handleAddItem = (item: SteamItem) => {
    const rarityMap: { [key: string]: 'common' | 'rare' | 'epic' | 'legendary' } = {
      'Consumer Grade': 'common',
      'Industrial Grade': 'common',
      'Mil-Spec': 'rare',
      'Restricted': 'rare',
      'Classified': 'epic',
      'Covert': 'legendary',
      'Extraordinary': 'legendary',
    };

    const rarity = rarityMap[item.rarity || ''] || 'common';

    const target: UpgradeTarget = {
      id: `target-${Date.now()}-${Math.random()}`,
      name: item.display_name || 'Unknown Item',
      rarity,
      icon: '🔫',
      price: Math.round(item.current_price || 100),
    };

    onAddTarget(target);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Добавить предметы в цели апгрейда</DialogTitle>
          <DialogDescription>
            Выберите предметы из базы Steam Market для добавления в доступные цели апгрейда
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Input
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Редкость" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все редкости</SelectItem>
                  <SelectItem value="Consumer Grade">Consumer Grade</SelectItem>
                  <SelectItem value="Industrial Grade">Industrial Grade</SelectItem>
                  <SelectItem value="Mil-Spec">Mil-Spec</SelectItem>
                  <SelectItem value="Restricted">Restricted</SelectItem>
                  <SelectItem value="Classified">Classified</SelectItem>
                  <SelectItem value="Covert">Covert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Мин. цена"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Макс. цена"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Icon name="Loader2" className="animate-spin" size={48} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-slate-900/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Предметы не найдены</p>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const rarityMap: { [key: string]: 'common' | 'rare' | 'epic' | 'legendary' } = {
                      'Consumer Grade': 'common',
                      'Industrial Grade': 'common',
                      'Mil-Spec': 'rare',
                      'Restricted': 'rare',
                      'Classified': 'epic',
                      'Covert': 'legendary',
                      'Extraordinary': 'legendary',
                    };
                    const rarity = rarityMap[item.rarity || ''] || 'common';

                    return (
                      <div
                        key={item.id}
                        className={`bg-gradient-to-br ${rarityColors[rarity]} border-2 rounded-lg p-3 relative group hover:scale-105 transition-all cursor-pointer`}
                        onClick={() => handleAddItem(item)}
                      >
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            <Icon name="Plus" size={16} className="mr-1" />
                            Добавить
                          </Button>
                        </div>

                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.display_name}
                            className="w-full h-24 object-contain mb-2"
                          />
                        )}
                        <div className="text-xs font-bold text-white text-center break-words line-clamp-2 mb-1">
                          {item.display_name}
                        </div>
                        <div className="text-xs text-gray-300 text-center">{item.rarity}</div>
                        <div className="text-sm font-bold text-green-400 text-center mt-1">
                          {item.current_price?.toFixed(0)} ₽
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
