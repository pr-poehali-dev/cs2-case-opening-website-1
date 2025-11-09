import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  balance: number;
  promoCode: string;
  activeSection: string;
  isAdmin?: boolean;
  username?: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  onSectionChange: (section: string) => void;
}

export default function Header({
  balance,
  promoCode,
  activeSection,
  isAdmin = false,
  username,
  onPromoCodeChange,
  onApplyPromo,
  onSectionChange,
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-neon-orange">TEST DROP</div>
              <div className="text-xs text-muted-foreground">У НАС ВЫИГРЫВАЮТ</div>
            </div>
            <nav className="hidden lg:flex gap-2">
              <Button
                variant={activeSection === 'cases' ? 'default' : 'ghost'}
                onClick={() => onSectionChange('cases')}
                className="gap-2"
              >
                <Icon name="Package" size={16} />
                КЕЙСЫ
              </Button>
              <Button
                variant={activeSection === 'contracts' ? 'default' : 'ghost'}
                onClick={() => onSectionChange('contracts')}
                className="gap-2"
              >
                <Icon name="Layers" size={16} />
                КОНТРАКТЫ
              </Button>
              <Button
                variant={activeSection === 'upgrade' ? 'default' : 'ghost'}
                onClick={() => onSectionChange('upgrade')}
                className="gap-2"
              >
                <Icon name="TrendingUp" size={16} />
                АПГРЕЙД
              </Button>
              <Button
                variant={activeSection === 'daily-bonus' ? 'default' : 'ghost'}
                onClick={() => onSectionChange('daily-bonus')}
                className="gap-2"
              >
                <Icon name="Gift" size={16} />
                БОНУС
              </Button>
              <Button
                variant={activeSection === 'promocodes' ? 'default' : 'ghost'}
                onClick={() => onSectionChange('promocodes')}
                className="gap-2"
              >
                <Icon name="Ticket" size={16} />
                ПРОМОКОДЫ
              </Button>
              {isAdmin && (
                <Button
                  variant={activeSection === 'admin' ? 'default' : 'ghost'}
                  onClick={() => onSectionChange('admin')}
                  className="gap-2 bg-red-500/20 border-red-500 hover:bg-red-500"
                >
                  <Icon name="Shield" size={16} />
                  АДМИН
                </Button>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Input
                value={promoCode}
                onChange={(e) => onPromoCodeChange(e.target.value)}
                placeholder="Промокод"
                className="w-32"
              />
              <Button onClick={onApplyPromo} size="sm" variant="outline">
                <Icon name="Check" size={16} />
              </Button>
            </div>
            <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green px-4 py-2 rounded-lg">
              <Icon name="Coins" size={20} className="text-neon-green" />
              <span className="font-bold text-lg">{balance}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSectionChange('profile')}
              className="gap-2"
            >
              <Icon name="User" size={20} />
              {username && <span className="hidden lg:inline">{username}</span>}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}