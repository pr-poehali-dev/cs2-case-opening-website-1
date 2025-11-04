import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import confetti from 'canvas-confetti';

interface DailyBonusProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

export default function DailyBonus({ balance, onBalanceChange }: DailyBonusProps) {
  const [lastClaim, setLastClaim] = useState<number>(() => {
    const saved = localStorage.getItem('cs2_last_daily_claim');
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [canClaim, setCanClaim] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('cs2_daily_streak');
    return saved ? parseInt(saved) : 0;
  });

  const CLAIM_COOLDOWN = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const checkClaimStatus = () => {
      const now = Date.now();
      const timeSinceLastClaim = now - lastClaim;

      if (timeSinceLastClaim >= CLAIM_COOLDOWN) {
        setCanClaim(true);
        setTimeLeft('Доступен!');
      } else {
        setCanClaim(false);
        const remaining = CLAIM_COOLDOWN - timeSinceLastClaim;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    checkClaimStatus();
    const interval = setInterval(checkClaimStatus, 1000);

    return () => clearInterval(interval);
  }, [lastClaim]);

  const claimBonus = () => {
    if (!canClaim) return;

    const bonusAmount = Math.floor(Math.random() * 96) + 5;
    
    onBalanceChange(bonusAmount);
    setClaimedAmount(bonusAmount);
    
    const now = Date.now();
    setLastClaim(now);
    localStorage.setItem('cs2_last_daily_claim', now.toString());

    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('cs2_daily_streak', newStreak.toString());

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fcd34d'],
    });

    setTimeout(() => {
      setClaimedAmount(null);
    }, 5000);
  };

  const bonusHistory = [
    { day: 1, reward: '5-100 ₽' },
    { day: 2, reward: '5-100 ₽' },
    { day: 3, reward: '5-100 ₽' },
    { day: 4, reward: '5-100 ₽' },
    { day: 5, reward: '5-100 ₽' },
    { day: 6, reward: '5-100 ₽' },
    { day: 7, reward: '5-100 ₽ + Бонус' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">Ежедневный бонус</h1>
          <p className="text-gray-400 text-lg">Заходи каждый день и получай награды!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full opacity-20 blur-2xl animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-yellow-600 to-orange-700 rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-2xl">
                <Icon name="Gift" size={80} className="text-white" />
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-yellow-400 mb-2">5-100 ₽</div>
              <div className="text-gray-400">Случайная награда</div>
            </div>

            {claimedAmount !== null && (
              <div className="mb-6 bg-green-500/20 border border-green-500 rounded-lg p-4 animate-bounce">
                <div className="flex items-center gap-2 text-green-400 font-bold text-xl">
                  <Icon name="CheckCircle2" size={24} />
                  <span>Получено: {claimedAmount} ₽</span>
                </div>
              </div>
            )}

            <div className="bg-slate-700/50 rounded-xl p-6 mb-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" className="text-blue-400" size={24} />
                  <span className="text-gray-300">Следующий бонус:</span>
                </div>
                <div className={`text-2xl font-bold ${canClaim ? 'text-green-400' : 'text-yellow-400'}`}>
                  {timeLeft}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Flame" className="text-orange-400" size={24} />
                  <span className="text-gray-300">Серия дней:</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">{streak}</div>
              </div>
            </div>

            <Button
              onClick={claimBonus}
              disabled={!canClaim}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-12 py-6 text-2xl font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
            >
              {canClaim ? (
                <>
                  <Icon name="Gift" className="mr-2" size={28} />
                  Получить бонус
                </>
              ) : (
                <>
                  <Icon name="Lock" className="mr-2" size={28} />
                  Недоступен
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Calendar" size={28} />
            Календарь наград
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {bonusHistory.map((item, index) => {
              const isToday = index + 1 === (streak % 7 || 7);
              const isClaimed = index < (streak % 7);

              return (
                <div
                  key={item.day}
                  className={`relative rounded-lg p-4 border-2 transition-all ${
                    isToday
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-yellow-500'
                      : isClaimed
                      ? 'bg-green-500/10 border-green-500/50'
                      : 'bg-slate-700/30 border-slate-600'
                  }`}
                >
                  {isClaimed && (
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-white" />
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2">День {item.day}</div>
                    <div className="text-4xl mb-2">
                      {item.day === 7 ? '🎁' : '💰'}
                    </div>
                    <div className="text-xs font-bold text-yellow-400">{item.reward}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" className="text-blue-400 flex-shrink-0 mt-1" size={20} />
              <div className="text-sm text-gray-300">
                <p className="font-bold mb-1">Как это работает:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Заходите каждый день и получайте случайную награду от 5 до 100 монет</li>
                  <li>На 7-й день серии получите дополнительный бонус</li>
                  <li>Пропустите день — серия сбросится</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
