import { useState, useEffect } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { useUpgradeHistory } from '@/contexts/UpgradeHistoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UpgradeHistory from '@/components/UpgradeHistory';
import UpgradeTargetManager from '@/components/admin/UpgradeTargetManager';
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

interface UpgradeProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

interface UpgradeTarget {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  price: number;
}

export default function Upgrade({ balance, onBalanceChange }: UpgradeProps) {
  const { items, removeItem, addItem } = useInventory();
  const { addHistoryItem } = useUpgradeHistory();
  const { user } = useAuth();
  const [selectedInputItem, setSelectedInputItem] = useState<string | null>(null);
  const [selectedTargetItem, setSelectedTargetItem] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<'win' | 'lose' | null>(null);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [sortBy, setSortBy] = useState<'price' | 'rarity'>('price');
  const [customTargets, setCustomTargets] = useState<UpgradeTarget[]>([]);
  const [showTargetManager, setShowTargetManager] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('upgrade_targets');
    if (saved) {
      setCustomTargets(JSON.parse(saved));
    }
  }, []);

  const handleAddTarget = (target: UpgradeTarget) => {
    const updated = [...customTargets, target];
    setCustomTargets(updated);
    localStorage.setItem('upgrade_targets', JSON.stringify(updated));
  };

  const handleRemoveTarget = (targetId: string) => {
    const updated = customTargets.filter(t => t.id !== targetId);
    setCustomTargets(updated);
    localStorage.setItem('upgrade_targets', JSON.stringify(updated));
  };

  const calculateWinChance = () => {
    if (!selectedInputItem || !selectedTargetItem) return 0;

    const inputItem = items.find((i) => i.id === selectedInputItem);
    const targetItem = [...items, ...customTargets].find((i) => i.id === selectedTargetItem);

    if (!inputItem || !targetItem) return 0;

    const inputValue = inputItem.price;
    const targetValue = targetItem.price;

    if (targetValue === 0) return 0;

    const chance = Math.min((inputValue / targetValue) * 100, 95);
    return Math.max(chance, 5);
  };

  const winChance = calculateWinChance();

  const executeUpgrade = () => {
    if (!selectedInputItem || !selectedTargetItem) return;

    const inputItem = items.find((i) => i.id === selectedInputItem);
    const targetItem = [...items, ...customTargets].find((i) => i.id === selectedTargetItem);

    if (!inputItem || !targetItem) return;

    setIsUpgrading(true);
    setUpgradeResult(null);

    const currentWinChance = winChance;

    const spinDuration = 4000;
    const spins = 8 + Math.floor(Math.random() * 4);
    
    const won = Math.random() * 100 < currentWinChance;
    
    const successZoneStart = 0;
    const successZoneEnd = (currentWinChance / 100) * 360;
    
    let finalAngle: number;
    if (won) {
      finalAngle = successZoneStart + Math.random() * (successZoneEnd - successZoneStart);
    } else {
      finalAngle = successZoneEnd + Math.random() * (360 - successZoneEnd);
    }
    
    const totalRotation = 360 * spins + finalAngle;
    setArrowRotation(totalRotation);

    setTimeout(() => {
      setUpgradeResult(won ? 'win' : 'lose');

      addHistoryItem({
        inputItems: [{
          name: inputItem.name,
          rarity: inputItem.rarity,
          price: inputItem.price,
          icon: inputItem.icon,
        }],
        targetItem: {
          name: targetItem.name,
          rarity: targetItem.rarity,
          price: targetItem.price,
          icon: targetItem.icon,
        },
        betAmount: 0,
        totalValue: inputItem.price,
        chance: currentWinChance,
        result: won ? 'win' : 'lose',
      });

      removeItem(selectedInputItem);

      if (won) {
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

      setTimeout(() => {
        setIsUpgrading(false);
        setSelectedInputItem(null);
        setSelectedTargetItem(null);
        setArrowRotation(0);
        setUpgradeResult(null);
      }, 2500);
    }, spinDuration);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    return rarityOrder.indexOf(b.rarity as Rarity) - rarityOrder.indexOf(a.rarity as Rarity);
  });

  const availableTargets = [...sortedItems, ...customTargets].filter(item => {
    if (!selectedInputItem) return false;
    const inputItem = items.find(i => i.id === selectedInputItem);
    if (!inputItem) return false;
    return item.id !== selectedInputItem && item.price > inputItem.price;
  }).sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">МОДЕРНИЗАЦИЯ ОРУЖИЯ</h1>

        <div className="mb-6">
          <UpgradeHistory />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
                  <span className="text-sm text-gray-400">Всего: {sortedItems.length} шт.</span>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'price' | 'rarity')}>
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
                  {sortedItems.map((item) => {
                    const isSelected = selectedInputItem === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedInputItem(item.id);
                          setSelectedTargetItem(null);
                        }}
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

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center">
            {!selectedInputItem || !selectedTargetItem ? (
              <div className="text-center">
                <Icon name="ArrowRightLeft" size={64} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Выберите предмет для апгрейда и цель</p>
              </div>
            ) : (
              <div className="w-full">
                <div className="relative w-64 h-64 mx-auto mb-6">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="20"
                    />
                    
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray={`${(winChance / 100) * 565.48} 565.48`}
                      className="transition-all duration-500"
                    />
                    
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray={`${((100 - winChance) / 100) * 565.48} 565.48`}
                      strokeDashoffset={`-${(winChance / 100) * 565.48}`}
                      className="transition-all duration-500"
                    />
                  </svg>

                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 transition-transform duration-[4000ms] ease-out origin-bottom"
                    style={{ 
                      transform: `translateX(-50%) rotate(${arrowRotation}deg)`,
                      height: '50%'
                    }}
                  >
                    <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-green-400 drop-shadow-lg" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-slate-900/80 rounded-full w-32 h-32 flex flex-col items-center justify-center border-4 border-slate-700">
                      {upgradeResult === null ? (
                        <>
                          <div className="text-4xl font-bold text-green-400">{winChance.toFixed(2)}%</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {isUpgrading ? 'крутится...' : 'шанс успеха'}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={`text-3xl font-bold ${upgradeResult === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                            {upgradeResult === 'win' ? 'СУПЕР!' : 'ПРОВАЛ'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {upgradeResult === 'win' ? 'вы это сделали' : 'неплохой шанс'}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Зона успеха:</span>
                      <span className="text-green-400 font-bold">{winChance.toFixed(2)}%</span>
                    </div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Зона провала:</span>
                      <span className="text-red-400 font-bold">{(100 - winChance).toFixed(2)}%</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={executeUpgrade}
                    disabled={isUpgrading || !selectedInputItem || !selectedTargetItem}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpgrading ? (
                      <>
                        <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                        Крутим...
                      </>
                    ) : (
                      <>
                        <Icon name="Zap" className="mr-2" size={20} />
                        ПОПЫТАТЬ УДАЧУ
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Выберите цель</h2>
              {user?.isAdmin && (
                <Button
                  size="sm"
                  onClick={() => setShowTargetManager(true)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Icon name="Plus" size={16} className="mr-1" />
                  Добавить из кейса
                </Button>
              )}
            </div>

            {!selectedInputItem ? (
              <div className="text-center py-12">
                <Icon name="Target" className="mx-auto text-gray-600 mb-4" size={64} />
                <p className="text-gray-400">Сначала выберите предмет слева</p>
              </div>
            ) : availableTargets.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="AlertCircle" className="mx-auto text-orange-500 mb-4" size={64} />
                <p className="text-gray-400">Нет доступных целей для апгрейда</p>
                <p className="text-xs text-gray-500 mt-2">Цель должна быть дороже входного предмета</p>
                {user?.isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => setShowTargetManager(true)}
                    className="mt-4 bg-purple-500 hover:bg-purple-600"
                  >
                    <Icon name="Plus" size={16} className="mr-1" />
                    Добавить цели
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                  <span>Доступно: {availableTargets.length} шт.</span>
                  <span className="flex items-center gap-1">
                    <Icon name="ArrowDown" size={14} />
                    Прокрутите вниз
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500">
                  {availableTargets.map((item) => {
                    const isSelected = selectedTargetItem === item.id;
                    const isCustomTarget = customTargets.some(t => t.id === item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTargetItem(item.id)}
                        disabled={isUpgrading}
                        className={`relative bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-xl p-4 transition-all
                          ${isSelected ? 'ring-4 ring-orange-500 scale-95' : 'hover:scale-105'}
                          ${isUpgrading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                            <Icon name="Target" size={20} />
                          </div>
                        )}

                        {user?.isAdmin && isCustomTarget && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTarget(item.id);
                            }}
                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10"
                            title="Удалить цель"
                          >
                            <Icon name="X" size={14} />
                          </button>
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
        </div>
      </div>

      <UpgradeTargetManager
        isOpen={showTargetManager}
        onClose={() => setShowTargetManager(false)}
        onAddTarget={handleAddTarget}
      />
    </div>
  );
}