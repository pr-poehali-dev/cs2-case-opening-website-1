import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface UpgradeWheelProps {
  winChance: number;
  arrowRotation: number;
  isUpgrading: boolean;
  upgradeResult: 'win' | 'lose' | null;
  hasSelection: boolean;
  onExecuteUpgrade: () => void;
}

export default function UpgradeWheel({
  winChance,
  arrowRotation,
  isUpgrading,
  upgradeResult,
  hasSelection,
  onExecuteUpgrade,
}: UpgradeWheelProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center">
      {!hasSelection ? (
        <div className="text-center">
          <Icon name="ArrowRightLeft" size={64} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">Выберите предмет для апгрейда и цель</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#1e293b"
                strokeWidth="20"
              />
              
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#10b981"
                strokeWidth="20"
                strokeDasharray={`${(winChance / 100) * 565.48} 565.48`}
                className="transition-all duration-500"
              />
              
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#ef4444"
                strokeWidth="20"
                strokeDasharray={`${((100 - winChance) / 100) * 565.48} 565.48`}
                strokeDashoffset={`-${(winChance / 100) * 565.48}`}
                className="transition-all duration-500"
              />
            </svg>

            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 transition-transform duration-[4000ms] ease-out origin-bottom"
              style={{ 
                transform: `translateX(-50%) rotate(${arrowRotation}deg)`,
                height: '50%'
              }}
            >
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-green-400 drop-shadow-lg" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-slate-900/80 rounded-full w-32 h-32 flex flex-col items-center justify-center border-4 border-slate-700">
                {upgradeResult === null ? (
                  <>
                    <div className="text-4xl font-bold text-green-400">{winChance.toFixed(2)}%</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {isUpgrading ? 'крутится...' : 'шанс успеха'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`text-3xl font-bold ${upgradeResult === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                      {upgradeResult === 'win' ? 'СУПЕР!' : 'ПРОВАЛ'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {upgradeResult === 'win' ? 'вы это сделали' : 'неплохой шанс'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Зона успеха:</span>
                <span className="text-green-400 font-bold">{winChance.toFixed(2)}%</span>
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Зона провала:</span>
                <span className="text-red-400 font-bold">{(100 - winChance).toFixed(2)}%</span>
              </div>
            </div>
            
            <Button
              onClick={onExecuteUpgrade}
              disabled={isUpgrading || !hasSelection}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpgrading ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                  Крутим...
                </>
              ) : (
                <>
                  <Icon name="Zap" className="mr-2" size={20} />
                  ПОПЫТАТЬ УДАЧУ
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
