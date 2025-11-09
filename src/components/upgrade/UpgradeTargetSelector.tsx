import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TargetItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  price: number;
}

interface UpgradeTargetSelectorProps {
  targets: TargetItem[];
  customTargetIds: string[];
  selectedTargetId: string | null;
  isUpgrading: boolean;
  hasInputItem: boolean;
  isAdmin: boolean;
  onSelectTarget: (id: string) => void;
  onRemoveTarget: (id: string) => void;
  onOpenTargetManager: () => void;
}

const rarityColors = {
  common: 'from-gray-600 to-gray-800 border-gray-500',
  rare: 'from-blue-600 to-blue-800 border-blue-500',
  epic: 'from-purple-600 to-purple-800 border-purple-500',
  legendary: 'from-orange-600 to-orange-800 border-orange-500',
};

const rarityNames = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
};

export default function UpgradeTargetSelector({
  targets,
  customTargetIds,
  selectedTargetId,
  isUpgrading,
  hasInputItem,
  isAdmin,
  onSelectTarget,
  onRemoveTarget,
  onOpenTargetManager,
}: UpgradeTargetSelectorProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Выберите цель</h2>
        {isAdmin && (
          <Button
            size="sm"
            onClick={onOpenTargetManager}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Icon name="Plus" size={16} className="mr-1" />
            Добавить из кейса
          </Button>
        )}
      </div>

      {!hasInputItem ? (
        <div className="text-center py-12">
          <Icon name="Target" className="mx-auto text-gray-600 mb-4" size={64} />
          <p className="text-gray-400">Сначала выберите предмет слева</p>
        </div>
      ) : targets.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="AlertCircle" className="mx-auto text-orange-500 mb-4" size={64} />
          <p className="text-gray-400">Нет доступных целей для апгрейда</p>
          <p className="text-xs text-gray-500 mt-2">Цель должна быть дороже входного предмета</p>
          {isAdmin && (
            <Button
              size="sm"
              onClick={onOpenTargetManager}
              className="mt-4 bg-purple-500 hover:bg-purple-600"
            >
              <Icon name="Plus" size={16} className="mr-1" />
              Добавить цели
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
            <span>Доступно: {targets.length} шт.</span>
            <span className="flex items-center gap-1">
              <Icon name="ArrowDown" size={14} />
              Прокрутите вниз
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hover:scrollbar-thumb-slate-500">
            {targets.map((item) => {
              const isSelected = selectedTargetId === item.id;
              const isCustomTarget = customTargetIds.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTarget(item.id)}
                  disabled={isUpgrading}
                  className={`relative bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-xl p-4 transition-all
                    ${isSelected ? 'ring-4 ring-orange-500 scale-95' : 'hover:scale-105'}
                    ${isUpgrading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                      <Icon name="Target" size={20} />
                    </div>
                  )}

                  {isAdmin && isCustomTarget && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTarget(item.id);
                      }}
                      className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10"
                      title="Удалить цель"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  )}

                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-xs font-bold text-white text-center break-words line-clamp-2 mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-300">{rarityNames[item.rarity]}</div>
                  <div className="text-sm font-bold text-green-400 mt-1">{item.price} ₽</div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
