import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onLogin: (username: string, email: string, steamId?: string, avatar?: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [steamInput, setSteamInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const extractSteamId = (input: string): string | null => {
    const trimmed = input.trim();
    
    if (/^\d{17}$/.test(trimmed)) {
      return trimmed;
    }
    
    const urlMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/);
    if (urlMatch) {
      return urlMatch[1];
    }
    
    const customMatch = trimmed.match(/steamcommunity\.com\/id\/([^/]+)/);
    if (customMatch) {
      return customMatch[1];
    }
    
    return null;
  };

  const handleSteamLogin = async () => {
    setError('');
    
    if (!steamInput) {
      setError('Введите Steam ID или ссылку на профиль');
      return;
    }

    const steamId = extractSteamId(steamInput);
    
    if (!steamId) {
      setError('Неверный формат Steam ID или ссылки');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsername = `Player_${steamId.slice(-4)}`;
      const mockEmail = `${steamId}@steam.local`;
      const mockAvatar = `https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg`;
      
      onLogin(mockUsername, mockEmail, steamId, mockAvatar);
    } catch (err) {
      setError('Ошибка при входе через Steam. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSteamLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-neon-orange mb-2">CASE🔥BATTLE</div>
          <p className="text-gray-400 text-lg">У НАС ВЫИГРЫВАЮТ</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border-2 border-slate-700 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Вход через Steam</h2>
            <p className="text-sm text-gray-400">
              Войдите с помощью вашего Steam аккаунта
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Steam ID или ссылка на профиль
              </label>
              <div className="relative">
                <Icon name="Link" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  value={steamInput}
                  onChange={(e) => setSteamInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="76561198XXXXXXXXX"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div>• Steam ID: 76561198XXXXXXXXX</div>
                <div>• Полная ссылка: https://steamcommunity.com/profiles/76561198XXXXXXXXX</div>
                <div>• Custom URL: https://steamcommunity.com/id/username</div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 flex items-center gap-2">
                <Icon name="AlertCircle" className="text-red-400" size={20} />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <Button
              onClick={handleSteamLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-6 text-lg font-bold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Icon name="Loader2" className="animate-spin" size={20} />
                  Вход...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                  </svg>
                  Войти через Steam
                </div>
              )}
            </Button>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-gray-300">
                <p className="font-bold mb-1">Как найти свой Steam ID?</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-400 text-xs">
                  <li>Откройте свой профиль в Steam</li>
                  <li>Скопируйте ссылку из адресной строки</li>
                  <li>Вставьте ссылку в поле выше</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-slate-800/50 px-4 py-2 rounded-lg">
            <Icon name="Shield" size={16} className="text-green-400" />
            Безопасный вход через Steam
          </div>
        </div>
      </div>
    </div>
  );
}
