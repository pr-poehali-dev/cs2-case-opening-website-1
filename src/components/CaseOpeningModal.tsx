import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { soundManager } from '@/utils/sounds';

interface Item {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

interface CaseOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseName: string;
  casePrice: number;
  onBalanceChange: (amount: number) => void;
}

const rarityColors = {
  common: 'from-gray-600 to-gray-800 border-gray-500',
  rare: 'from-blue-600 to-blue-800 border-blue-500',
  epic: 'from-purple-600 to-purple-800 border-purple-500',
  legendary: 'from-orange-600 to-orange-800 border-orange-500',
};

const generateItems = (): Item[] => {
  const items: Item[] = [];
  const itemNames = [
    'AK-47 | Редлайн',
    'AWP | Азимов',
    'M4A4 | Хоулинг',
    'Glock | Выцвет',
    'USP-S | Кортекс',
    'P250 | Сандуни',
    'Галил | Церберус',
    'FAMAS | Крио',
  ];

  for (let i = 0; i < 50; i++) {
    const randomRarity = Math.random();
    let rarity: 'common' | 'rare' | 'epic' | 'legendary';
    
    if (randomRarity > 0.95) rarity = 'legendary';
    else if (randomRarity > 0.8) rarity = 'epic';
    else if (randomRarity > 0.5) rarity = 'rare';
    else rarity = 'common';

    items.push({
      id: i,
      name: itemNames[Math.floor(Math.random() * itemNames.length)],
      rarity,
      icon: ['🔫', '🗡️', '🎯', '⚔️'][Math.floor(Math.random() * 4)],
    });
  }
  return items;
};

export default function CaseOpeningModal({
  isOpen,
  onClose,
  caseName,
  casePrice,
  onBalanceChange,
}: CaseOpeningModalProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [items] = useState<Item[]>(generateItems());
  const [wonItem, setWonItem] = useState<Item | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsSpinning(false);
      setWonItem(null);
      setScrollPosition(0);
    }
  }, [isOpen]);

  const startSpin = () => {
    setIsSpinning(true);
    onBalanceChange(-casePrice);

    soundManager.playSpinStart();
    setTimeout(() => soundManager.playSpinning(), 200);

    const winIndex = Math.floor(Math.random() * 10) + 20;
    const finalPosition = -(winIndex * 140 - window.innerWidth / 2 + 70);
    
    setScrollPosition(finalPosition);

    setTimeout(() => {
      setIsSpinning(false);
      const wonItem = items[winIndex];
      setWonItem(wonItem);
      soundManager.playWin(wonItem.rarity);
    }, 5000);
  };

  const handleClose = () => {
    if (!isSpinning) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl bg-card border-border">
        <div className="py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{caseName}</h2>
            <p className="text-muted-foreground">Открытие кейса</p>
          </div>

          <div className="relative h-64 mb-8 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-1 h-full bg-neon-orange"></div>
            
            <div
              className="flex gap-4 absolute top-1/2 transform -translate-y-1/2 transition-all"
              style={{
                left: scrollPosition,
                transitionDuration: isSpinning ? '5000ms' : '0ms',
                transitionTimingFunction: isSpinning ? 'cubic-bezier(0.22, 0.61, 0.36, 1)' : 'ease',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex-shrink-0 w-32 h-40 bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-lg p-3 flex flex-col items-center justify-center`}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-xs text-center font-medium">{item.name}</div>
                </div>
              ))}
            </div>
          </div>

          {!wonItem && !isSpinning && (
            <div className="text-center">
              <Button
                onClick={startSpin}
                onMouseEnter={() => soundManager.playHover()}
                className="bg-neon-green hover:bg-neon-green/80 text-white font-bold text-lg px-12 py-6"
              >
                Открыть за {casePrice} ₽
              </Button>
            </div>
          )}

          {wonItem && (
            <div className="text-center animate-fade-in">
              <div className="bg-gradient-to-br from-neon-orange/20 to-neon-purple/20 border-2 border-neon-orange rounded-lg p-8 mb-4">
                <div className="text-6xl mb-4">{wonItem.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{wonItem.name}</h3>
                <div className="text-muted-foreground mb-4">
                  Редкость: {wonItem.rarity === 'legendary' ? 'Легендарная' : wonItem.rarity === 'epic' ? 'Эпическая' : wonItem.rarity === 'rare' ? 'Редкая' : 'Обычная'}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    soundManager.playClick();
                    startSpin();
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className="bg-neon-green hover:bg-neon-green/80 text-white font-bold px-8"
                >
                  <Icon name="RotateCw" size={18} className="mr-2" />
                  Открыть ещё
                </Button>
                <Button
                  onClick={() => {
                    soundManager.playClick();
                    handleClose();
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  variant="outline"
                  className="font-bold px-8"
                >
                  Закрыть
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}