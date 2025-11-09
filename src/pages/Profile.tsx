import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileOverview from '@/components/ProfileOverview';
import ProfileInventory from '@/components/ProfileInventory';
import ProfileStats from '@/components/ProfileStats';
import ProfileSettings from '@/components/ProfileSettings';

interface ProfileProps {
  username: string;
  email: string;
  balance: number;
  steamId?: string;
  avatar?: string;
  tradeUrl?: string;
  onLogout: () => void;
  onSellItem: (price: number) => void;
  onUseInUpgrade: (itemId: string) => void;
  onWithdrawItem: (itemId: string) => void;
}

export default function Profile({ 
  username, 
  email, 
  balance, 
  steamId, 
  avatar, 
  tradeUrl, 
  onLogout, 
  onSellItem, 
  onUseInUpgrade, 
  onWithdrawItem 
}: ProfileProps) {
  const { items, removeItem } = useInventory();
  const { user, setTradeUrl } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings' | 'inventory'>('overview');
  const [showTradeUrlReminder, setShowTradeUrlReminder] = useState(false);

  const totalSpent = 15420;
  const casesOpened = 187;
  const biggestWin = 12450;
  const registeredDate = '15 октября 2024';
  const totalWinnings = items.reduce((acc, item) => acc + item.price, 0);

  const recentActivity = [
    { type: 'case', name: 'СЛЕНДЕР', result: 'AWP | Азимов', value: 8500, time: '5 минут назад' },
    { type: 'upgrade', name: 'Апгрейд', result: 'Успешно', value: 2300, time: '1 час назад' },
    { type: 'case', name: 'ДЖИНН', result: 'M4A4 | Корень', value: 4200, time: '3 часа назад' },
    { type: 'contract', name: 'Контракт', result: 'AK-47 | Редлайн', value: 1850, time: '5 часов назад' },
    { type: 'case', name: 'БУГИМЕН', result: 'Glock | Лунная меандра', value: 890, time: 'Вчера' },
  ];

  const achievements = [
    { icon: '🎯', name: 'Первая победа', description: 'Открыли первый кейс', unlocked: true },
    { icon: '💎', name: 'Богач', description: 'Выиграли предмет дороже 10000₽', unlocked: true },
    { icon: '🔥', name: 'Везунчик', description: 'Открыли 100 кейсов', unlocked: true },
    { icon: '⭐', name: 'Легенда', description: 'Открыли 500 кейсов', unlocked: false },
    { icon: '👑', name: 'Миллионер', description: 'Выиграли на сумму 1,000,000₽', unlocked: false },
    { icon: '🎰', name: 'Азартный', description: 'Потратили 50,000₽', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          username={username}
          email={email}
          balance={balance}
          steamId={steamId}
          avatar={avatar}
          casesOpened={casesOpened}
          totalSpent={totalSpent}
          biggestWin={biggestWin}
          onLogout={onLogout}
        />

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="LayoutDashboard" size={18} />
            Обзор
          </Button>
          <Button
            variant={activeTab === 'inventory' ? 'default' : 'outline'}
            onClick={() => setActiveTab('inventory')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Package" size={18} />
            Инвентарь
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="BarChart" size={18} />
            Статистика
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Settings" size={18} />
            Настройки
          </Button>
        </div>

        {activeTab === 'overview' && (
          <ProfileOverview 
            recentActivity={recentActivity}
            achievements={achievements}
          />
        )}

        {activeTab === 'inventory' && (
          <>
            <ProfileInventory
              items={items}
              hasTradeUrl={!!user?.tradeUrl}
              onSellItem={onSellItem}
              onUseInUpgrade={onUseInUpgrade}
              onWithdrawItem={onWithdrawItem}
              onRemoveItem={removeItem}
              onShowTradeUrlReminder={() => setShowTradeUrlReminder(true)}
            />

            {showTradeUrlReminder && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTradeUrlReminder(false)}>
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="AlertCircle" size={28} className="text-orange-400" />
                    <h3 className="text-xl font-bold">Trade URL не привязан</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Для вывода предметов необходимо привязать Steam Trade URL в настройках профиля.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowTradeUrlReminder(false);
                        setActiveTab('settings');
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Icon name="Settings" size={18} className="mr-2" />
                      Перейти в настройки
                    </Button>
                    <Button
                      onClick={() => setShowTradeUrlReminder(false)}
                      variant="outline"
                    >
                      Позже
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <ProfileStats
            totalWinnings={totalWinnings}
            totalSpent={totalSpent}
            casesOpened={casesOpened}
            biggestWin={biggestWin}
            registeredDate={registeredDate}
          />
        )}

        {activeTab === 'settings' && (
          <ProfileSettings
            username={username}
            email={email}
            tradeUrl={tradeUrl}
            onSaveTradeUrl={setTradeUrl}
          />
        )}
      </div>
    </div>
  );
}