import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface InventoryItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  caseName: string;
  price: number;
  wonAt: number;
}

interface ProfileInventoryProps {
  items: InventoryItem[];
  hasTradeUrl: boolean;
  onSellItem: (price: number) => void;
  onUseInContract: (itemId: string) => void;
  onUseInUpgrade: (itemId: string) => void;
  onWithdrawItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onShowTradeUrlReminder: () => void;
}

const rarityColors = {
  common: 'from-gray-600 to-gray-800 border-gray-500',
  rare: 'from-blue-600 to-blue-800 border-blue-500',
  epic: 'from-purple-600 to-purple-800 border-purple-500',
  legendary: 'from-orange-600 to-orange-800 border-orange-500',
};

const rarityNames = {
  common: 'Обычная',
  rare: 'Редкая',
  epic: 'Эпическая',
  legendary: 'Легендарная',
};

export default function ProfileInventory({
  items,
  hasTradeUrl,
  onSellItem,
  onUseInContract,
  onUseInUpgrade,
  onWithdrawItem,
  onRemoveItem,
  onShowTradeUrlReminder,
}: ProfileInventoryProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Мой инвентарь</h2>
            <p className="text-sm text-gray-400">
              Всего предметов: {items.length} • Общая стоимость: {items.reduce((sum, item) => sum + item.price, 0)} ₽
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">Инвентарь пуст</h3>
            <p className="text-gray-400">Откройте кейсы, чтобы получить предметы</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-lg p-4 relative hover:scale-105 transition-transform`}
              >
                <Badge className="absolute top-2 right-2 bg-black/80 text-white border-0 text-xs">
                  {item.caseName}
                </Badge>

                <div className="aspect-square mb-4 flex items-center justify-center">
                  <div className="text-6xl">{item.icon}</div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">{rarityNames[item.rarity]}</span>
                    <span className="font-bold text-green-400">{item.price} ₽</span>
                  </div>

                  <div className="flex gap-1 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 px-2 hover:bg-blue-500/20 hover:border-blue-500 border border-transparent"
                      title="Использовать в контракте"
                      onClick={() => onUseInContract(item.id)}
                    >
                      <Icon name="Layers" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 px-2 hover:bg-purple-500/20 hover:border-purple-500 border border-transparent"
                      title="Использовать в апгрейде"
                      onClick={() => onUseInUpgrade(item.id)}
                    >
                      <Icon name="TrendingUp" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 px-2 hover:bg-green-500/20 hover:border-green-500 border border-transparent"
                      title="Продать"
                      onClick={() => {
                        onSellItem(item.price);
                        onRemoveItem(item.id);
                      }}
                    >
                      <Icon name="DollarSign" size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 h-8 px-2 hover:bg-orange-500/20 hover:border-orange-500 border border-transparent"
                      title="Вывести в Steam"
                      onClick={() => {
                        if (!hasTradeUrl) {
                          onShowTradeUrlReminder();
                        } else {
                          onWithdrawItem(item.id);
                          onRemoveItem(item.id);
                        }
                      }}
                    >
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
