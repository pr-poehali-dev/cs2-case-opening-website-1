import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CaseOpeningModal from '@/components/CaseOpeningModal';
import InventorySection from '@/components/InventorySection';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CaseGrid from '@/components/CaseGrid';
import LiveDrops from '@/components/LiveDrops';
import Contracts from '@/pages/Contracts';
import Upgrade from '@/pages/Upgrade';
import DailyBonus from '@/pages/DailyBonus';
import Promocodes from '@/pages/Promocodes';
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

  if (activeSection === 'promocodes') {
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
        <Promocodes balance={balance} onBalanceChange={handleBalanceChange} />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        balance={balance}
        promoCode={promoCode}
        activeSection={activeSection}
        onPromoCodeChange={setPromoCode}
        onApplyPromo={applyPromo}
        onSectionChange={setActiveSection}
      />

      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          sidebarOpen={sidebarOpen}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-7xl">
            <LiveDrops weapons={weapons} />

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">КЕЙСЫ</h2>
              <CaseGrid cases={cases} onCaseClick={handleCaseClick} />
            </div>

            <InventorySection
              items={items}
              onSellItem={handleSellItem}
            />
          </div>
        </main>
      </div>

      {selectedCase && (
        <CaseOpeningModal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          caseName={selectedCase.name}
          casePrice={selectedCase.price}
          balance={balance}
          onBalanceChange={handleBalanceChange}
        />
      )}
    </div>
  );
};

export default Index;
