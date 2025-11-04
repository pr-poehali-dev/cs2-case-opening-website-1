import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useInventory } from '@/contexts/InventoryContext';

interface SidebarProps {
  activeSection: string;
  sidebarOpen: boolean;
  isAdmin?: boolean;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, sidebarOpen, isAdmin = false, onSectionChange }: SidebarProps) {
  const { items } = useInventory();

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 border-r border-border bg-card/30 backdrop-blur p-4 hidden xl:block">
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">МЕНЮ</h3>
          <div className="space-y-2">
            <Button
              variant={activeSection === 'cases' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => onSectionChange('cases')}
            >
              <Icon name="Package" size={18} />
              Кейсы
            </Button>
            <Button
              variant={activeSection === 'contracts' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => onSectionChange('contracts')}
            >
              <Icon name="Layers" size={18} />
              Контракты
            </Button>
            <Button
              variant={activeSection === 'upgrade' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => onSectionChange('upgrade')}
            >
              <Icon name="TrendingUp" size={18} />
              Апгрейд
            </Button>
            <Button
              variant={activeSection === 'daily-bonus' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => onSectionChange('daily-bonus')}
            >
              <Icon name="Gift" size={18} />
              Ежедневный бонус
            </Button>
            <Button
              variant={activeSection === 'promocodes' ? 'default' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => onSectionChange('promocodes')}
            >
              <Icon name="Ticket" size={18} />
              Промокоды
            </Button>
            {isAdmin && (
              <Button
                variant={activeSection === 'admin' ? 'default' : 'ghost'}
                className="w-full justify-start gap-2 bg-red-500/20 border-red-500 hover:bg-red-500"
                onClick={() => onSectionChange('admin')}
              >
                <Icon name="Shield" size={18} />
                Админ-панель
              </Button>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">ИНВЕНТАРЬ</h3>
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Предметов:</span>
              <span className="text-sm font-bold">{items.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Стоимость:</span>
              <span className="text-sm font-bold text-neon-green">
                {items.reduce((acc, item) => acc + item.price, 0)} ₽
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">СТАТИСТИКА</h3>
          <div className="space-y-3">
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="TrendingUp" size={16} className="text-neon-green" />
                <span className="text-xs text-muted-foreground">Открыто кейсов</span>
              </div>
              <div className="text-lg font-bold">1,234</div>
            </div>
            <div className="bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="Award" size={16} className="text-neon-orange" />
                <span className="text-xs text-muted-foreground">Лучший дроп</span>
              </div>
              <div className="text-lg font-bold">12,450 ₽</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}