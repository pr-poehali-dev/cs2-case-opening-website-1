import { useUpgradeHistory } from '@/contexts/UpgradeHistoryContext';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const rarityColors = {
  common: 'from-gray-600 to-gray-800 border-gray-500',
  rare: 'from-blue-600 to-blue-800 border-blue-500',
  epic: 'from-purple-600 to-purple-800 border-purple-500',
  legendary: 'from-orange-600 to-orange-800 border-orange-500',
};

export default function UpgradeHistory() {
  const { history, clearHistory } = useUpgradeHistory();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    return `${days} д назад`;
  };

  if (history.length === 0) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">История апгрейдов</h2>
        <div className="text-center py-12">
          <Icon name="History" className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-400">История пуста. Сделайте первый апгрейд!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">История апгрейдов</h2>
        <Button onClick={clearHistory} variant="outline" size="sm">
          <Icon name="Trash2" className="mr-2" size={16} />
          Очистить
        </Button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {history.map((item) => (
          <div
            key={item.id}
            className={`relative bg-slate-700/50 rounded-lg p-4 border-2 transition-all ${
              item.result === 'win'
                ? 'border-green-500/50 bg-green-500/5'
                : 'border-red-500/50 bg-red-500/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  <Icon
                    name={item.result === 'win' ? 'TrendingUp' : 'TrendingDown'}
                    className="text-white"
                    size={24}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white truncate">
                    {item.inputItems.length} предмет(а) → {item.targetItem.name}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(item.timestamp)}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Ставка:</span>
                    <span className="text-orange-400 font-bold">{item.totalValue.toFixed(0)} ₽</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Шанс:</span>
                    <span className="text-blue-400 font-bold">{item.chance.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">Результат:</span>
                    <span
                      className={`font-bold ${item.result === 'win' ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {item.result === 'win' ? 'ПОБЕДА' : 'ПРОИГРЫШ'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {item.inputItems.slice(0, 3).map((inputItem, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${
                          rarityColors[inputItem.rarity as keyof typeof rarityColors]
                        } border-2 flex items-center justify-center text-sm`}
                        title={inputItem.name}
                      >
                        {inputItem.icon}
                      </div>
                    ))}
                    {item.inputItems.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-500 flex items-center justify-center text-xs text-white font-bold">
                        +{item.inputItems.length - 3}
                      </div>
                    )}
                  </div>

                  <Icon name="ArrowRight" className="text-gray-500" size={16} />

                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                      rarityColors[item.targetItem.rarity as keyof typeof rarityColors]
                    } border-2 flex items-center justify-center text-lg`}
                    title={item.targetItem.name}
                  >
                    {item.targetItem.icon}
                  </div>
                </div>
              </div>

              {item.result === 'win' && (
                <div className="flex-shrink-0 text-right">
                  <div className="text-green-400 font-bold text-lg">
                    +{item.targetItem.price} ₽
                  </div>
                  <div className="text-xs text-gray-400">получено</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
