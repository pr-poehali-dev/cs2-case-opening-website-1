import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SectionHeaderProps {
  balance: number;
  onBackClick: () => void;
}

export default function SectionHeader({ balance, onBackClick }: SectionHeaderProps) {
  return (
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
              onClick={onBackClick}
            >
              <Icon name="Home" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
