import { useState, useEffect } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface UpgradeProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

export default function Upgrade({ balance, onBalanceChange }: UpgradeProps) {
  const { items, removeItem, addItem } = useInventory();
  const [selectedInputItems, setSelectedInputItems] = useState<string[]>([]);
  const [selectedTargetItem, setSelectedTargetItem] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(0);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<'win' | 'lose' | null>(null);
  const [targetRotation, setTargetRotation] = useState(0);
  const [sortBy, setSortBy] = useState<'price' | 'rarity'>('price');

  const maxBet = Math.min(balance, 10000);

  const multipliers = [2, 5, 10, 25, 50, 75, 100];

  const toggleInputItem = (id: string) => {
    setSelectedInputItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 6 ? [...prev, id] : prev
    );
  };

  const calculateWinChance = () => {
    if (selectedInputItems.length === 0 || !selectedTargetItem) return 0;

    const inputValue = selectedInputItems.reduce((sum, id) => {
      const item = items.find((i) => i.id === id);
      return sum + (item?.price || 0);
    }, 0) + betAmount;

    const targetItem = items.find((i) => i.id === selectedTargetItem);
    const targetValue = targetItem?.price || 0;

    if (targetValue === 0) return 0;

    const chance = Math.min((inputValue / targetValue) * 100, 95);
    return Math.max(chance, 5);
  };

  const winChance = calculateWinChance();

  const executeUpgrade = () => {
    if (selectedInputItems.length === 0 || !selectedTargetItem || betAmount > balance) return;

    setIsUpgrading(true);
    setUpgradeResult(null);

    const spinDuration = 3000;
    const spins = 5;
    const finalRotation = 360 * spins + (Math.random() * 360);
    setTargetRotation(finalRotation);

    setTimeout(() => {
      const won = Math.random() * 100 < winChance;
      setUpgradeResult(won ? 'win' : 'lose');

      selectedInputItems.forEach((id) => removeItem(id));
      onBalanceChange(-betAmount);

      if (won) {
        const targetItem = items.find((i) => i.id === selectedTargetItem);
        if (targetItem) {
          addItem({
            name: targetItem.name,
            rarity: targetItem.rarity,
            icon: targetItem.icon,
            caseName: 'Upgrade',
            price: targetItem.price,
          });

          if (targetItem.rarity === 'legendary') {
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
          } else if (targetItem.rarity === 'epic') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#a855f7', '#c084fc', '#e9d5ff'],
            });
          }
        }
      }

      setTimeout(() => {
        setIsUpgrading(false);
        setSelectedInputItems([]);
        setSelectedTargetItem(null);
        setBetAmount(0);
        setTargetRotation(0);
      }, 2000);
    }, spinDuration);
  };

  const inputValue = selectedInputItems.reduce((sum, id) => {
    const item = items.find((i) => i.id === id);
    return sum + (item?.price || 0);
  }, 0) + betAmount;

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    return rarityOrder.indexOf(b.rarity as Rarity) - rarityOrder.indexOf(a.rarity as Rarity);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">МОДЕРНИЗАЦИЯ ОРУЖИЯ 2.0</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Выберите до 6ти предметов на апгрейд</h2>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Package" className="mx-auto text-gray-600 mb-4" size={64} />
                <p className="text-gray-400">Ваш инвентарь пуст</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {sortedItems.map((item) => {
                  const isSelected = selectedInputItems.includes(item.id);
                  const isDisabled = selectedInputItems.length === 6 && !isSelected;

                  return (
                    <button
                      key={item.id}
                      onClick={() => !isDisabled && toggleInputItem(item.id)}
                      disabled={isDisabled || isUpgrading}
                      className={`relative bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-xl p-3 transition-all
                        ${isSelected ? 'ring-4 ring-orange-500 scale-95' : 'hover:scale-105'}
                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shadow-lg">
                          {selectedInputItems.indexOf(item.id) + 1}
                        </div>
                      )}

                      <div className="text-3xl mb-1">{item.icon}</div>
                      <div className="text-xs font-bold text-white text-center break-words line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-xs text-orange-400 text-center mt-1 font-bold">
                        {item.price} ₽
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Добавить баланс:</span>
                  <span className="text-lg font-bold text-orange-400">{betAmount.toFixed(1)} ₽ (макс {maxBet})</span>
                </div>
                <Slider
                  value={[betAmount]}
                  onValueChange={(values) => setBetAmount(values[0])}
                  max={maxBet}
                  step={0.1}
                  className="w-full"
                  disabled={isUpgrading}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {multipliers.map((mult) => (
                  <Button
                    key={mult}
                    onClick={() => setBetAmount(Math.min(betAmount * mult, maxBet))}
                    variant="outline"
                    size="sm"
                    disabled={isUpgrading}
                    className="flex-1 min-w-[60px]"
                  >
                    x{mult}
                  </Button>
                ))}
                <Button
                  onClick={() => setBetAmount(0)}
                  variant="outline"
                  size="sm"
                  disabled={isUpgrading}
                  className="flex-1 min-w-[60px]"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Общая ставка:</span>
                  <span className="text-xl font-bold text-orange-400">{inputValue.toFixed(1)} ₽</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Выберите оружие, которое хотите получить</h2>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Цена</SelectItem>
                  <SelectItem value="rarity">Редкость</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Package" className="mx-auto text-gray-600 mb-4" size={64} />
                <p className="text-gray-400">Нет доступных предметов</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {sortedItems
                  .filter((item) => !selectedInputItems.includes(item.id))
                  .map((item) => {
                    const isSelected = selectedTargetItem === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTargetItem(isSelected ? null : item.id)}
                        disabled={isUpgrading}
                        className={`relative bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-xl p-3 transition-all
                          ${isSelected ? 'ring-4 ring-green-500 scale-95' : 'hover:scale-105'}
                          cursor-pointer
                        `}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                            <Icon name="Check" size={16} />
                          </div>
                        )}

                        <div className="text-3xl mb-1">{item.icon}</div>
                        <div className="text-xs font-bold text-white text-center break-words line-clamp-2">
                          {item.name}
                        </div>
                        <div className="text-xs text-orange-400 text-center mt-1 font-bold">
                          {item.price} ₽
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.3)"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="20"
                    strokeDasharray={`${(winChance / 100) * 502.4} 502.4`}
                    className="transition-all duration-500"
                    style={{
                      transform: `rotate(${targetRotation}deg)`,
                      transformOrigin: 'center',
                      transition: isUpgrading ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-orange-400">{winChance.toFixed(0)}%</div>
                  <div className="text-sm text-gray-400 mt-1">шанс победы</div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <Button
                onClick={executeUpgrade}
                disabled={selectedInputItems.length === 0 || !selectedTargetItem || betAmount > balance || isUpgrading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-8 text-2xl font-bold disabled:opacity-50"
              >
                {isUpgrading ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={32} />
                    Идет загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="TrendingUp" className="mr-2" size={32} />
                    ПРОКАЧАТЬ
                  </>
                )}
              </Button>

              {upgradeResult && (
                <div
                  className={`mt-4 p-4 rounded-lg text-center font-bold text-lg ${
                    upgradeResult === 'win'
                      ? 'bg-green-500/20 text-green-400 border border-green-500'
                      : 'bg-red-500/20 text-red-400 border border-red-500'
                  }`}
                >
                  {upgradeResult === 'win' ? '🎉 ПОБЕДА! Предмет получен!' : '😢 Неудача. Попробуйте еще раз!'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
