import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Item {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  price: number;
}

interface UpgradeItemSelectorProps {
  items: Item[];
  selectedItemId: string | null;
  sortBy: 'price' | 'rarity';
  isUpgrading: boolean;
  onSelectItem: (id: string) => void;
  onSortChange: (sortBy: 'price' | 'rarity') => void;
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

export default function UpgradeItemSelector({
  items,
  selectedItemId,
  sortBy,
  isUpgrading,
  onSelectItem,
  onSortChange,
}: UpgradeItemSelectorProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold mb-4">Выберите предмет</h2>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Package" className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-gray-400">Ваш инвентарь пуст</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Всего: {items.length} шт.</span>
            <Select value={sortBy} onValueChange={(v) => onSortChange(v as 'price' | 'rarity')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">По цене</SelectItem>
                <SelectItem value="rarity">По редкости</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500">
            {items.map((item) => {
              const isSelected = selectedItemId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  disabled={isUpgrading}
                  className={`relative bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-xl p-4 transition-all
                    ${isSelected ? 'ring-4 ring-green-500 scale-95' : 'hover:scale-105'}
                    ${isUpgrading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                      <Icon name="Check" size={20} />
                    </div>
                  )}

                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-xs font-bold text-white text-center break-words line-clamp-2 mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-300">{rarityNames[item.rarity]}</div>
                  <div className="text-sm font-bold text-green-400 mt-1">{item.price} ₽</div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
