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

  const loadSteamItems = () => {
    setIsLoading(true);
    
    const mockItems: SteamItem[] = [
      { id: 1, display_name: 'AK-47 | Redline', weapon_type: 'Rifle', rarity: 'Classified', current_price: 450, image_url: '' },
      { id: 2, display_name: 'AWP | Asiimov', weapon_type: 'Sniper Rifle', rarity: 'Covert', current_price: 1200, image_url: '' },
      { id: 3, display_name: 'M4A4 | Howl', weapon_type: 'Rifle', rarity: 'Covert', current_price: 8500, image_url: '' },
      { id: 4, display_name: 'Desert Eagle | Blaze', weapon_type: 'Pistol', rarity: 'Restricted', current_price: 680, image_url: '' },
      { id: 5, display_name: 'Glock-18 | Fade', weapon_type: 'Pistol', rarity: 'Restricted', current_price: 520, image_url: '' },
      { id: 6, display_name: 'USP-S | Kill Confirmed', weapon_type: 'Pistol', rarity: 'Classified', current_price: 780, image_url: '' },
      { id: 7, display_name: 'P250 | Asiimov', weapon_type: 'Pistol', rarity: 'Classified', current_price: 320, image_url: '' },
      { id: 8, display_name: 'M4A1-S | Hyper Beast', weapon_type: 'Rifle', rarity: 'Classified', current_price: 590, image_url: '' },
      { id: 9, display_name: 'StatTrak™ AK-47 | Vulcan', weapon_type: 'Rifle', rarity: 'Classified', current_price: 1850, image_url: '' },
      { id: 10, display_name: 'Karambit | Fade', weapon_type: 'Knife', rarity: 'Extraordinary', current_price: 12500, image_url: '' },
      { id: 11, display_name: 'Butterfly Knife | Tiger Tooth', weapon_type: 'Knife', rarity: 'Extraordinary', current_price: 9800, image_url: '' },
      { id: 12, display_name: 'Bayonet | Doppler', weapon_type: 'Knife', rarity: 'Extraordinary', current_price: 7200, image_url: '' },
      { id: 13, display_name: 'AK-47 | Fire Serpent', weapon_type: 'Rifle', rarity: 'Classified', current_price: 3200, image_url: '' },
      { id: 14, display_name: 'AWP | Dragon Lore', weapon_type: 'Sniper Rifle', rarity: 'Covert', current_price: 15000, image_url: '' },
      { id: 15, display_name: 'M4A4 | Emperor', weapon_type: 'Rifle', rarity: 'Classified', current_price: 420, image_url: '' },
      { id: 16, display_name: 'P90 | Asiimov', weapon_type: 'SMG', rarity: 'Classified', current_price: 280, image_url: '' },
      { id: 17, display_name: 'Five-SeveN | Case Hardened', weapon_type: 'Pistol', rarity: 'Mil-Spec', current_price: 180, image_url: '' },
      { id: 18, display_name: 'MP7 | Nemesis', weapon_type: 'SMG', rarity: 'Restricted', current_price: 220, image_url: '' },
      { id: 19, display_name: 'Galil AR | Sugar Rush', weapon_type: 'Rifle', rarity: 'Mil-Spec', current_price: 95, image_url: '' },
      { id: 20, display_name: 'MAC-10 | Neon Rider', weapon_type: 'SMG', rarity: 'Classified', current_price: 340, image_url: '' },
      { id: 21, display_name: 'SSG 08 | Blood in the Water', weapon_type: 'Sniper Rifle', rarity: 'Classified', current_price: 890, image_url: '' },
      { id: 22, display_name: 'StatTrak™ USP-S | Neo-Noir', weapon_type: 'Pistol', rarity: 'Classified', current_price: 1150, image_url: '' },
      { id: 23, display_name: 'Falchion Knife | Slaughter', weapon_type: 'Knife', rarity: 'Extraordinary', current_price: 4500, image_url: '' },
      { id: 24, display_name: 'M9 Bayonet | Crimson Web', weapon_type: 'Knife', rarity: 'Extraordinary', current_price: 6800, image_url: '' },
      { id: 25, display_name: 'Glock-18 | Water Elemental', weapon_type: 'Pistol', rarity: 'Restricted', current_price: 145, image_url: '' },
      { id: 26, display_name: 'AK-47 | Neon Revolution', weapon_type: 'Rifle', rarity: 'Classified', current_price: 680, image_url: '' },
      { id: 27, display_name: 'AWP | Neo-Noir', weapon_type: 'Sniper Rifle', rarity: 'Covert', current_price: 950, image_url: '' },
      { id: 28, display_name: 'Desert Eagle | Kumicho Dragon', weapon_type: 'Pistol', rarity: 'Covert', current_price: 1420, image_url: '' },
      { id: 29, display_name: 'StatTrak™ M4A4 | Asiimov', weapon_type: 'Rifle', rarity: 'Covert', current_price: 2100, image_url: '' },
      { id: 30, display_name: 'Talon Knife | Case Hardened', weapon_type: 'Knife', rarity: 'Extraordinary', current_price: 8900, image_url: '' },
    ];
    
    setTimeout(() => {
      setSteamItems(mockItems);
      setIsLoading(false);
    }, 500);
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