import Icon from '@/components/ui/icon';

interface Weapon {
  name: string;
  subtitle: string;
  icon: string;
}

interface LiveDropsProps {
  weapons: Weapon[];
}

export default function LiveDrops({ weapons }: LiveDropsProps) {
  return (
    <div className="bg-card/30 backdrop-blur rounded-xl border border-border p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Radio" size={20} className="text-neon-orange animate-pulse" />
        <h2 className="text-xl font-bold">ПОСЛЕДНИЕ ДРОПЫ</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {weapons.map((weapon, i) => (
          <div
            key={i}
            className="bg-card/50 rounded-lg p-3 border border-border hover:border-neon-orange transition-colors cursor-pointer"
          >
            <div className="text-3xl mb-2 text-center">{weapon.icon}</div>
            <div className="text-xs text-center">
              <div className="font-semibold truncate">{weapon.name}</div>
              <div className="text-muted-foreground truncate">{weapon.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
