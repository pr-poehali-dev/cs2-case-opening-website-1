import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import confetti from 'canvas-confetti';

interface PromocodesProps {
  balance: number;
  onBalanceChange: (amount: number) => void;
}

interface Promocode {
  code: string;
  reward: number;
  description: string;
  usesLeft?: number;
}

const ACTIVE_PROMOCODES: Promocode[] = [
  { code: 'WELCOME100', reward: 100, description: 'Приветственный бонус для новых игроков' },
  { code: 'LUCKY777', reward: 777, description: 'Удача на твоей стороне!' },
  { code: 'WEEKEND50', reward: 50, description: 'Выходной бонус' },
  { code: 'CS2PROMO', reward: 250, description: 'Специальное предложение CS2' },
  { code: 'MEGABONUS', reward: 500, description: 'Мегабонус для активных игроков' },
];

export default function Promocodes({ balance, onBalanceChange }: PromocodesProps) {
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [usedCodes, setUsedCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('cs2_used_promocodes');
    return saved ? JSON.parse(saved) : [];
  });

  const applyPromocode = () => {
    const trimmedCode = promoCode.trim().toUpperCase();
    
    if (!trimmedCode) {
      setMessage({ text: 'Введите промокод', type: 'error' });
      return;
    }

    if (usedCodes.includes(trimmedCode)) {
      setMessage({ text: 'Этот промокод уже использован', type: 'error' });
      return;
    }

    const promo = ACTIVE_PROMOCODES.find(p => p.code === trimmedCode);

    if (!promo) {
      setMessage({ text: 'Промокод не найден или истек', type: 'error' });
      return;
    }

    onBalanceChange(promo.reward);
    
    const newUsedCodes = [...usedCodes, trimmedCode];
    setUsedCodes(newUsedCodes);
    localStorage.setItem('cs2_used_promocodes', JSON.stringify(newUsedCodes));

    setMessage({ text: `Успешно! Получено ${promo.reward} монет`, type: 'success' });
    setPromoCode('');

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7'],
    });

    setTimeout(() => setMessage(null), 5000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      applyPromocode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">Промокоды</h1>
          <p className="text-gray-400 text-lg">Активируй промокод и получи бонус!</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-6">
              <div className="relative">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="ВВЕДИТЕ ПРОМОКОД"
                  className="text-center text-2xl font-bold py-8 bg-slate-700/50 border-slate-600 focus:border-orange-500 uppercase"
                  maxLength={20}
                />
                <Icon 
                  name="Ticket" 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
                  size={28} 
                />
              </div>
            </div>

            <Button
              onClick={applyPromocode}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl mb-6"
            >
              <Icon name="Check" className="mr-2" size={24} />
              Активировать промокод
            </Button>

            {message && (
              <div
                className={`w-full max-w-md p-4 rounded-lg border-2 text-center font-bold animate-bounce ${
                  message.type === 'success'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-red-500/20 border-red-500 text-red-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon 
                    name={message.type === 'success' ? 'CheckCircle2' : 'XCircle'} 
                    size={24} 
                  />
                  <span>{message.text}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={28} />
            Активные промокоды
          </h2>

          <div className="grid gap-3">
            {ACTIVE_PROMOCODES.map((promo) => {
              const isUsed = usedCodes.includes(promo.code);

              return (
                <div
                  key={promo.code}
                  className={`relative rounded-lg p-4 border-2 transition-all ${
                    isUsed
                      ? 'bg-gray-700/30 border-gray-600 opacity-50'
                      : 'bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/50 hover:border-orange-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <code className="text-xl font-bold text-orange-400 bg-slate-700/50 px-3 py-1 rounded">
                          {promo.code}
                        </code>
                        {isUsed && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                            ИСПОЛЬЗОВАН
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{promo.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">+{promo.reward}</div>
                        <div className="text-xs text-gray-400">монет</div>
                      </div>

                      {!isUsed && (
                        <Button
                          onClick={() => {
                            setPromoCode(promo.code);
                            applyPromocode();
                          }}
                          variant="outline"
                          className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                        >
                          <Icon name="Copy" size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={28} />
            Где найти промокоды?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Icon name="Send" className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Telegram</h3>
                  <p className="text-xs text-gray-400">Следи за новостями</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Подпишись на наш канал и получай эксклюзивные промокоды первым!
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Icon name="Youtube" className="text-red-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">YouTube</h3>
                  <p className="text-xs text-gray-400">Смотри стримы</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Промокоды раздаются во время трансляций и в описании видео!
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Icon name="Users" className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Сообщество</h3>
                  <p className="text-xs text-gray-400">Общайся с игроками</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Участвуй в обсуждениях и получай промокоды за активность!
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Icon name="Calendar" className="text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">События</h3>
                  <p className="text-xs text-gray-400">Участвуй в акциях</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Специальные промокоды на праздники и игровые события!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="text-blue-400 flex-shrink-0 mt-1" size={20} />
            <div className="text-sm text-gray-300">
              <p className="font-bold mb-1">Важно:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Каждый промокод можно использовать только один раз</li>
                <li>Промокоды чувствительны к регистру букв</li>
                <li>Некоторые промокоды имеют ограниченный срок действия</li>
                <li>Следи за обновлениями, чтобы не пропустить новые промокоды!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
