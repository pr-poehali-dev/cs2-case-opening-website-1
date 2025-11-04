import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useInventory } from '@/contexts/InventoryContext';
import { soundManager } from '@/utils/sounds';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

interface InventorySectionProps {
  onSellItem: (price: number) => void;
  balance: number;
}

export default function InventorySection({ onSellItem, balance }: InventorySectionProps) {
  const { items, removeItem, clearInventory } = useInventory();
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [itemToSell, setItemToSell] = useState<{ id: string; name: string; price: number } | null>(null);

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">МОЙ ИНВЕНТАРЬ</h1>
            <p className="text-muted-foreground">
              Всего предметов: {items.length} • Общая стоимость: {totalValue} ₽
            </p>
          </div>
          {items.length > 0 && (
            <Button
              onClick={() => {
                soundManager.playClick();
                clearInventory();
              }}
              variant="destructive"
              className="gap-2"
            >
              <Icon name="Trash2" size={18} />
              Очистить инвентарь
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold mb-2">Инвентарь пуст</h2>
            <p className="text-muted-foreground">
              Откройте кейсы, чтобы получить предметы
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-lg p-4 relative group hover:scale-105 transition-transform`}
              >
                <Badge className="absolute top-2 right-2 bg-background/80 text-foreground border-0 text-xs">
                  {item.caseName}
                </Badge>

                <div className="aspect-square mb-4 flex items-center justify-center">
                  <div className="text-6xl">{item.icon}</div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {rarityNames[item.rarity]}
                    </span>
                    <span className="font-bold text-neon-green">{item.price} ₽</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(item.wonAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1 bg-neon-green/10 border-neon-green hover:bg-neon-green/20"
                      onClick={() => {
                        soundManager.playClick();
                        setItemToSell({ id: item.id, name: item.name, price: item.price });
                        setSellDialogOpen(true);
                      }}
                    >
                      <Icon name="DollarSign" size={14} />
                      Продать
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/50 hover:bg-destructive/10"
                      onClick={() => {
                        soundManager.playClick();
                        removeItem(item.id);
                      }}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">Продать предмет?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                {itemToSell && (
                  <div className="space-y-4 mt-4">
                    <div className="bg-neon-green/10 border border-neon-green rounded-lg p-4">
                      <div className="text-foreground font-bold text-lg mb-2">
                        {itemToSell.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Вы получите:</span>
                        <span className="text-neon-green font-bold text-xl">
                          +{itemToSell.price} ₽
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ваш баланс после продажи: {balance + itemToSell.price} ₽
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => soundManager.playClick()}
                className="font-bold"
              >
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (itemToSell) {
                    soundManager.playWin('rare');
                    onSellItem(itemToSell.price);
                    removeItem(itemToSell.id);
                    setSellDialogOpen(false);
                    setItemToSell(null);
                  }
                }}
                className="bg-neon-green hover:bg-neon-green/80 font-bold"
              >
                <Icon name="DollarSign" size={18} className="mr-2" />
                Продать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}