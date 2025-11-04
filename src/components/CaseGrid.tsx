import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface CaseItem {
  id: number;
  name: string;
  items: number;
  price: number;
  isNew: boolean;
  gradient: string;
  borderColor: string;
}

interface CaseGridProps {
  cases: CaseItem[];
  onCaseClick: (caseItem: CaseItem) => void;
}

export default function CaseGrid({ cases, onCaseClick }: CaseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cases.map((caseItem) => (
        <div
          key={caseItem.id}
          className={`bg-gradient-to-br ${caseItem.gradient} rounded-xl border-2 ${caseItem.borderColor} p-6 hover:scale-105 transition-transform cursor-pointer relative overflow-hidden group`}
          onClick={() => onCaseClick(caseItem)}
        >
          {caseItem.isNew && (
            <Badge className="absolute top-3 right-3 bg-neon-orange text-white border-none">
              NEW
            </Badge>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">📦</div>
              <h3 className="text-xl font-bold mb-1">{caseItem.name}</h3>
              <p className="text-sm text-muted-foreground">{caseItem.items} предметов</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Coins" size={20} className="text-neon-green" />
                <span className="text-lg font-bold">{caseItem.price}</span>
              </div>
              <Button size="sm" className="bg-neon-orange hover:bg-neon-orange/90">
                Открыть
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
