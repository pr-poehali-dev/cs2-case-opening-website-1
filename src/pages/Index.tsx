import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import CaseOpeningModal from '@/components/CaseOpeningModal';
import InventorySection from '@/components/InventorySection';
import Contracts from '@/pages/Contracts';
import Upgrade from '@/pages/Upgrade';
import DailyBonus from '@/pages/DailyBonus';
import { soundManager } from '@/utils/sounds';
import { useInventory } from '@/contexts/InventoryContext';

const weapons = [
  { name: 'AK-47', subtitle: 'Фиолетовый', icon: '🔫' },
  { name: 'StatTrak™ Five-SeveN', subtitle: 'Оцененное дело', icon: '🔫' },
  { name: 'M93', subtitle: 'Гиппоз', icon: '🔫' },
  { name: 'AWP', subtitle: 'Кортисебра', icon: '🔫' },
  { name: 'AK-47', subtitle: 'Красная линия', icon: '🔫' },
  { name: 'Desert Eagle', subtitle: 'Код красный', icon: '🔫' },
  { name: 'Desert Eagle', subtitle: 'Заговор', icon: '🔫' },
  { name: 'StatTrak™ AK-47', subtitle: 'Сланец', icon: '🔫' },
];

const cases = [
  {
    id: 1,
    name: 'ЧУПАКАБРА',
    items: 48,
    price: 29,
    isNew: true,
    gradient: 'from-gray-800 to-gray-900',
    borderColor: 'border-gray-600',
  },
  {
    id: 2,
    name: 'ПИКОВАЯ ДАМА',
    items: 47,
    price: 79,
    isNew: true,
    gradient: 'from-gray-800 to-gray-900',
    borderColor: 'border-gray-600',
  },
  {
    id: 3,
    name: 'БУГИМЕН',
    items: 48,
    price: 149,
    isNew: true,
    gradient: 'from-emerald-900/40 to-emerald-600/40',
    borderColor: 'border-neon-green',
  },
  {
    id: 4,
    name: 'ДЖИНН',
    items: 45,
    price: 499,
    isNew: true,
    gradient: 'from-blue-900/40 to-blue-600/40',
    borderColor: 'border-neon-blue',
  },
  {
    id: 5,
    name: 'СЛЕНДЕР',
    items: 47,
    price: 999,
    isNew: false,
    gradient: 'from-orange-900/40 to-orange-600/40',
    borderColor: 'border-neon-orange',
  },
  {
    id: 6,
    name: 'MIRAGE',
    items: 44,
    price: 35,
    isNew: false,
    gradient: 'from-orange-900/40 to-orange-600/40',
    borderColor: 'border-neon-orange',
  },
  {
    id: 7,
    name: 'NUKE',
    items: 41,
    price: 85,
    isNew: false,
    gradient: 'from-blue-900/40 to-blue-600/40',
    borderColor: 'border-neon-blue',
  },
  {
    id: 8,
    name: 'ANCIENT',
    items: 38,
    price: 275,
    isNew: false,
    gradient: 'from-emerald-900/40 to-emerald-600/40',
    borderColor: 'border-neon-green',
  },
  {
    id: 9,
    name: 'INFERNO',
    items: 42,
    price: 555,
    isNew: false,
    gradient: 'from-orange-900/40 to-orange-600/40',
    borderColor: 'border-neon-orange',
  },
  {
    id: 10,
    name: 'DUST 2',
    items: 42,
    price: 1355,
    isNew: false,
    gradient: 'from-gray-800 to-gray-900',
    borderColor: 'border-gray-600',
  },
];

const Index = () => {
  const { items } = useInventory();
  const [balance, setBalance] = useState(1723);
  const [promoCode, setPromoCode] = useState('');
  const [activeSection, setActiveSection] = useState('cases');
  const [sidebarOpen] = useState(true);
  const [selectedCase, setSelectedCase] = useState<{name: string; price: number} | null>(null);

  const applyPromo = () => {
    if (promoCode === 'SIGN-15') {
      setBalance(balance + Math.floor(balance * 0.15));
      setPromoCode('');
    }
  };

  const handleCaseClick = (caseItem: typeof cases[0]) => {
    setSelectedCase({ name: caseItem.name, price: caseItem.price });
  };

  const handleBalanceChange = (amount: number) => {
    setBalance(balance + amount);
  };

  const handleSellItem = (price: number) => {
    setBalance(balance + price);
  };

  if (activeSection === 'daily-bonus') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-neon-orange">CASE🔥BATTLE</div>
                  <div className="text-xs text-muted-foreground">У НАС ВЫИГРЫВАЮТ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green px-4 py-2 rounded-lg">
                  <Icon name="Coins" size={20} className="text-neon-green" />
                  <span className="font-bold text-lg">{balance}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('cases')}
                >
                  <Icon name="Home" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <DailyBonus balance={balance} onBalanceChange={handleBalanceChange} />
      </div>
    );
  }

  if (activeSection === 'upgrade') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-neon-orange">CASE🔥BATTLE</div>
                  <div className="text-xs text-muted-foreground">У НАС ВЫИГРЫВАЮТ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green px-4 py-2 rounded-lg">
                  <Icon name="Coins" size={20} className="text-neon-green" />
                  <span className="font-bold text-lg">{balance}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('cases')}
                >
                  <Icon name="Home" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <Upgrade balance={balance} onBalanceChange={handleBalanceChange} />
      </div>
    );
  }

  if (activeSection === 'contracts') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-neon-orange">CASE🔥BATTLE</div>
                  <div className="text-xs text-muted-foreground">У НАС ВЫИГРЫВАЮТ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green px-4 py-2 rounded-lg">
                  <Icon name="Coins" size={20} className="text-neon-green" />
                  <span className="font-bold text-lg">{balance}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('cases')}
                >
                  <Icon name="Home" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <Contracts />
      </div>
    );
  }

  if (activeSection === 'profile') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-neon-orange">CASE🔥BATTLE</div>
                  <div className="text-xs text-muted-foreground">У НАС ВЫИГРЫВАЮТ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green px-4 py-2 rounded-lg">
                  <Icon name="Coins" size={20} className="text-neon-green" />
                  <span className="font-bold text-lg">{balance}</span>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection('cases')}
                >
                  <Icon name="Home" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>
        <InventorySection onSellItem={handleSellItem} balance={balance} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-neon-orange">CASE🔥BATTLE</div>
                <div className="text-xs text-muted-foreground">У НАС ВЫИГРЫВАЮТ</div>
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <Button
                  variant={activeSection === 'upgrade' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('upgrade')}
                  className="gap-2"
                >
                  <Icon name="TrendingUp" size={16} />
                  АПГРЕЙД
                </Button>
                <Button
                  variant={activeSection === 'contracts' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('contracts')}
                  className="gap-2"
                >
                  <Icon name="FileText" size={16} />
                  КОНТРАКТЫ
                </Button>
                <Button
                  variant={activeSection === 'daily-bonus' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('daily-bonus')}
                  className="gap-2"
                >
                  <Icon name="Gift" size={16} />
                  БОНУС
                </Button>
                <Button
                  variant={activeSection === 'tournaments' ? 'default' : 'ghost'}
                  onClick={() => setActiveSection('tournaments')}
                  className="gap-2"
                >
                  <Icon name="Trophy" size={16} />
                  ТУРНИРЫ
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green px-4 py-2 rounded-lg">
                <Icon name="Coins" size={20} className="text-neon-green" />
                <span className="font-bold text-lg">{balance}</span>
              </div>

              <Button
                variant="ghost"
                className="gap-2 relative"
                onClick={() => {
                  soundManager.playClick();
                  setActiveSection('profile');
                }}
              >
                <Icon name="Package" size={20} />
                {items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-neon-orange text-white border-0 text-xs px-1.5">
                    {items.length}
                  </Badge>
                )}
                <span className="hidden md:inline">Инвентарь</span>
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Send" size={18} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Youtube" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-3 rounded-lg transform -rotate-2">
              <div className="text-white font-bold text-xl">+15% НА СЧЕТ</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-sm text-muted-foreground mb-2">ИСПОЛЬЗУЙ ПРОМОКОД:</div>
              <div className="bg-neon-blue/20 border-2 border-neon-blue px-8 py-2 rounded text-neon-blue font-bold text-2xl">
                SIGN-15
              </div>
            </div>

            <div className="bg-neon-purple/20 border-2 border-neon-purple px-6 py-3 rounded-lg">
              <div className="text-sm text-muted-foreground">ОСТАЛОСЬ</div>
              <div className="text-neon-purple font-bold text-xl">01:18:48</div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full max-w-md">
            <Input
              placeholder="Что ищем?"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-card border-border"
            />
            <Button onClick={applyPromo} className="bg-neon-green hover:bg-neon-green/80">
              Применить
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {sidebarOpen && (
            <aside className="w-48 bg-sidebar rounded-lg p-4 space-y-2 hidden lg:block">
              {weapons.map((weapon, index) => (
                <button
                  key={index}
                  onMouseEnter={() => soundManager.playHover()}
                  onClick={() => soundManager.playClick()}
                  className="w-full text-left p-3 rounded hover:bg-sidebar-accent transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{weapon.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-neon-green transition-colors">
                        {weapon.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {weapon.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </aside>
          )}

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-6 text-center tracking-wider">
                СЕРИЙНЫЕ КЕЙСЫ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => {
                    soundManager.playClick();
                    handleCaseClick(caseItem);
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className={`bg-gradient-to-br ${caseItem.gradient} border-2 ${caseItem.borderColor} rounded-lg p-4 hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group`}
                >
                  {caseItem.isNew && (
                    <Badge className="absolute top-2 right-2 bg-red-600 text-white border-0">
                      NEW
                    </Badge>
                  )}

                  <div className="aspect-square mb-4 flex items-center justify-center">
                    <div className="text-6xl group-hover:scale-110 transition-transform">
                      📦
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-1 tracking-wide">
                      {caseItem.name}
                    </h3>
                    <div className="text-sm text-muted-foreground mb-3">
                      {caseItem.items} предметов
                    </div>
                    <Button
                      className="w-full bg-card/80 hover:bg-card border border-border text-foreground font-bold"
                      variant="outline"
                    >
                      {caseItem.price} ₽
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {selectedCase && (
        <CaseOpeningModal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          caseName={selectedCase.name}
          casePrice={selectedCase.price}
          onBalanceChange={handleBalanceChange}
        />
      )}
    </div>
  );
};

export default Index;