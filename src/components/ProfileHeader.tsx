import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ProfileHeaderProps {
  username: string;
  email: string;
  balance: number;
  steamId?: string;
  avatar?: string;
  casesOpened: number;
  totalSpent: number;
  biggestWin: number;
  onLogout: () => void;
}

export default function ProfileHeader({
  username,
  email,
  balance,
  steamId,
  avatar,
  casesOpened,
  totalSpent,
  biggestWin,
  onLogout,
}: ProfileHeaderProps) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-6">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-24 h-24 rounded-full border-4 border-blue-500"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-4xl font-bold">
              {username[0].toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">{username}</h1>
              {steamId && (
                <a
                  href={`https://steamcommunity.com/profiles/${steamId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                  </svg>
                </a>
              )}
            </div>
            <p className="text-gray-400 mb-2">{email}</p>
            {steamId && (
              <p className="text-sm text-gray-500 mb-2">Steam ID: {steamId}</p>
            )}
            <div className="flex gap-2">
              <Badge className="bg-green-500">Активен</Badge>
              {steamId && <Badge className="bg-blue-500">Steam</Badge>}
              <Badge className="bg-purple-500">Проверенный</Badge>
            </div>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        >
          <Icon name="LogOut" size={18} className="mr-2" />
          Выйти
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Баланс</div>
          <div className="text-2xl font-bold text-green-400">{balance} ₽</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Открыто кейсов</div>
          <div className="text-2xl font-bold">{casesOpened}</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Потрачено</div>
          <div className="text-2xl font-bold text-orange-400">{totalSpent.toLocaleString()} ₽</div>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Лучший выигрыш</div>
          <div className="text-2xl font-bold text-yellow-400">{biggestWin.toLocaleString()} ₽</div>
        </div>
      </div>
    </div>
  );
}
