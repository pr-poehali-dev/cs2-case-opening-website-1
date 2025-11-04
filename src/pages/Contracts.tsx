import { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import confetti from 'canvas-confetti';

const rarityOrder = ['common', 'rare', 'epic', 'legendary'] as const;
type Rarity = typeof rarityOrder[number];

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

const rarityPrices = {
  common: 50,
  rare: 150,
  epic: 400,
  legendary: 1200,
};

export default function Contracts() {
  const { items, removeItem, addItem } = useInventory();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const getUpgradeRarity = (currentRarity: Rarity): Rarity | null => {
    const currentIndex = rarityOrder.indexOf(currentRarity);
    return currentIndex < rarityOrder.length - 1 ? rarityOrder[currentIndex + 1] : null;
  };

  const canUpgrade = () => {
    if (selectedItems.length !== 5) return false;
    
    const selectedRarities = selectedItems.map(id => {
      const item = items.find(i => i.id === id);
      return item?.rarity;
    });
    
    const firstRarity = selectedRarities[0];
    return selectedRarities.every(r => r === firstRarity) && firstRarity !== 'legendary';
  };

  const executeContract = () => {
    if (!canUpgrade()) return;

    setIsProcessing(true);

    const currentRarity = items.find(i => i.id === selectedItems[0])?.rarity as Rarity;
    const newRarity = getUpgradeRarity(currentRarity);

    if (!newRarity) return;

    setTimeout(() => {
      selectedItems.forEach(id => removeItem(id));

      const itemNames: Record<Rarity, string[]> = {
        common: ['Glock | Выцвет', 'P250 | Сандуни', 'MP9 | Дартс'],
        rare: ['AK-47 | Редлайн', 'USP-S | Кортекс', 'FAMAS | Крио'],
        epic: ['AWP | Азимов', 'M4A4 | Хоулинг', 'Галил | Церберус'],
        legendary: ['AK-47 | Огненный змей', 'AWP | Драконья легенда', 'M4A4 | Вой']
      };

      const randomName = itemNames[newRarity][Math.floor(Math.random() * itemNames[newRarity].length)];
      const icons = ['🔫', '🗡️', '🎯', '⚔️'];

      addItem({
        name: randomName,
        rarity: newRarity,
        icon: icons[Math.floor(Math.random() * icons.length)],
        caseName: 'Trade-Up Contract',
        price: rarityPrices[newRarity],
      });

      if (newRarity === 'legendary') {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#f97316', '#fb923c', '#fdba74'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#f97316', '#fb923c', '#fdba74'],
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      } else if (newRarity === 'epic') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#c084fc', '#e9d5ff'],
        });
      }

      setSelectedItems([]);
      setIsProcessing(false);
    }, 1500);
  };

  const selectedRarity = selectedItems.length > 0 
    ? items.find(i => i.id === selectedItems[0])?.rarity 
    : null;

  const targetRarity = selectedRarity ? getUpgradeRarity(selectedRarity as Rarity) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Trade-Up контракты</h1>
          <p className="text-gray-400">Обменяйте 5 предметов одной редкости на 1 более редкий</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{selectedItems.length}/5</div>
                <div className="text-sm text-gray-400">Выбрано</div>
              </div>
              
              {selectedRarity && targetRarity && (
                <>
                  <Icon name="ArrowRight" className="text-gray-500" size={32} />
                  <div className="text-center">
                    <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${rarityColors[targetRarity as Rarity]}`}>
                      <div className="text-lg font-bold text-white">{rarityNames[targetRarity as Rarity]}</div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Результат</div>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={executeContract}
              disabled={!canUpgrade() || isProcessing}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg"
            >
              {isProcessing ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" />
                  Обработка...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" className="mr-2" />
                  Выполнить контракт
                </>
              )}
            </Button>
          </div>

          {selectedItems.length > 0 && !canUpgrade() && selectedItems.length === 5 && (
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg">
              <Icon name="AlertTriangle" size={20} />
              <span>Все выбранные предметы должны быть одной редкости</span>
            </div>
          )}
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Ваш инвентарь</h2>
          
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Package" className="mx-auto text-gray-600 mb-4" size={64} />
              <p className="text-gray-400">Ваш инвентарь пуст. Откройте кейсы, чтобы получить предметы!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const isDisabled = selectedItems.length === 5 && !isSelected;
                const isWrongRarity = selectedRarity && item.rarity !== selectedRarity && selectedItems.length > 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => !isDisabled && !isWrongRarity && toggleItem(item.id)}
                    disabled={isDisabled || isWrongRarity}
                    className={`relative bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-xl p-4 transition-all
                      ${isSelected ? 'ring-4 ring-white scale-95' : 'hover:scale-105'}
                      ${isDisabled || isWrongRarity ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                        {selectedItems.indexOf(item.id) + 1}
                      </div>
                    )}
                    
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="text-sm font-bold text-white text-center break-words">
                      {item.name}
                    </div>
                    <div className="text-xs text-white/80 text-center mt-1">
                      {rarityNames[item.rarity]}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
