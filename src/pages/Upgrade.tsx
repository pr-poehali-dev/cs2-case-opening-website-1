import { useState, useEffect } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import { useUpgradeHistory } from '@/contexts/UpgradeHistoryContext';
import { useAuth } from '@/contexts/AuthContext';
import UpgradeHistory from '@/components/UpgradeHistory';
import UpgradeTargetManager from '@/components/admin/UpgradeTargetManager';
import UpgradeItemSelector from '@/components/upgrade/UpgradeItemSelector';
import UpgradeWheel from '@/components/upgrade/UpgradeWheel';
import UpgradeTargetSelector from '@/components/upgrade/UpgradeTargetSelector';
import confetti from 'canvas-confetti';

const rarityOrder = ['common', 'rare', 'epic', 'legendary'] as const;
type Rarity = typeof rarityOrder[number];

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

  const handleSelectInputItem = (id: string) => {
    setSelectedInputItem(id);
    setSelectedTargetItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">МОДЕРНИЗАЦИЯ ОРУЖИЯ</h1>

        <div className="mb-6">
          <UpgradeHistory />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <UpgradeItemSelector
            items={sortedItems}
            selectedItemId={selectedInputItem}
            sortBy={sortBy}
            isUpgrading={isUpgrading}
            onSelectItem={handleSelectInputItem}
            onSortChange={setSortBy}
          />

          <UpgradeWheel
            winChance={winChance}
            arrowRotation={arrowRotation}
            isUpgrading={isUpgrading}
            upgradeResult={upgradeResult}
            hasSelection={!!selectedInputItem && !!selectedTargetItem}
            onExecuteUpgrade={executeUpgrade}
          />

          <UpgradeTargetSelector
            targets={availableTargets}
            customTargetIds={customTargets.map(t => t.id)}
            selectedTargetId={selectedTargetItem}
            isUpgrading={isUpgrading}
            hasInputItem={!!selectedInputItem}
            isAdmin={user?.isAdmin || false}
            onSelectTarget={setSelectedTargetItem}
            onRemoveTarget={handleRemoveTarget}
            onOpenTargetManager={() => setShowTargetManager(true)}
          />
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
