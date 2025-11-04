import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useInventory } from '@/contexts/InventoryContext';

interface ProfileProps {
  username: string;
  email: string;
  balance: number;
  onLogout: () => void;
}

export default function Profile({ username, email, balance, onLogout }: ProfileProps) {
  const { items } = useInventory();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings'>('overview');
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);

  const totalSpent = 15420;
  const casesOpened = 187;
  const biggestWin = 12450;
  const registeredDate = '15 октября 2024';
  const totalWinnings = items.reduce((acc, item) => acc + item.price, 0);

  const recentActivity = [
    { type: 'case', name: 'СЛЕНДЕР', result: 'AWP | Азимов', value: 8500, time: '5 минут назад' },
    { type: 'upgrade', name: 'Апгрейд', result: 'Успешно', value: 2300, time: '1 час назад' },
    { type: 'case', name: 'ДЖИНН', result: 'M4A4 | Корень', value: 4200, time: '3 часа назад' },
    { type: 'contract', name: 'Контракт', result: 'AK-47 | Редлайн', value: 1850, time: '5 часов назад' },
    { type: 'case', name: 'БУГИМЕН', result: 'Glock | Лунная меандра', value: 890, time: 'Вчера' },
  ];

  const achievements = [
    { icon: '🎯', name: 'Первая победа', description: 'Открыли первый кейс', unlocked: true },
    { icon: '💎', name: 'Богач', description: 'Выиграли предмет дороже 10000₽', unlocked: true },
    { icon: '🔥', name: 'Везунчик', description: 'Открыли 100 кейсов', unlocked: true },
    { icon: '⭐', name: 'Легенда', description: 'Открыли 500 кейсов', unlocked: false },
    { icon: '👑', name: 'Миллионер', description: 'Выиграли на сумму 1,000,000₽', unlocked: false },
    { icon: '🎰', name: 'Азартный', description: 'Потратили 50,000₽', unlocked: false },
  ];

  const handleSaveProfile = () => {
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-4xl font-bold">
                {username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{username}</h1>
                <p className="text-gray-400 mb-2">{email}</p>
                <div className="flex gap-2">
                  <Badge className="bg-green-500">Активен</Badge>
                  <Badge className="bg-blue-500">Проверенный</Badge>
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

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="LayoutDashboard" size={18} />
            Обзор
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="BarChart" size={18} />
            Статистика
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Settings" size={18} />
            Настройки
          </Button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Activity" size={24} />
                Последняя активность
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Icon
                          name={activity.type === 'case' ? 'Package' : activity.type === 'upgrade' ? 'TrendingUp' : 'Layers'}
                          size={24}
                          className="text-orange-400"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{activity.name}</div>
                        <div className="text-sm text-gray-400">{activity.result}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">+{activity.value} ₽</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Trophy" size={24} />
                Достижения
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500'
                        : 'bg-slate-700/20 border-slate-600 opacity-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-bold mb-1">{achievement.name}</div>
                    <div className="text-xs text-gray-400">{achievement.description}</div>
                    {achievement.unlocked && (
                      <Badge className="mt-2 bg-green-500 text-white text-xs">
                        Разблокировано
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
                <h2 className="text-xl font-bold mb-4">Общая статистика</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Всего выиграно:</span>
                    <span className="font-bold text-green-400">{totalWinnings.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Всего потрачено:</span>
                    <span className="font-bold text-orange-400">{totalSpent.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Чистая прибыль:</span>
                    <span className={`font-bold ${totalWinnings - totalSpent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(totalWinnings - totalSpent).toLocaleString()} ₽
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Средний выигрыш:</span>
                    <span className="font-bold">{Math.round(totalWinnings / casesOpened).toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Win rate:</span>
                    <span className="font-bold text-blue-400">
                      {((totalWinnings / totalSpent) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
                <h2 className="text-xl font-bold mb-4">Информация об аккаунте</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Дата регистрации:</span>
                    <span className="font-bold">{registeredDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Предметов в инвентаре:</span>
                    <span className="font-bold">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Использовано промокодов:</span>
                    <span className="font-bold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Достижений:</span>
                    <span className="font-bold">
                      {achievements.filter((a) => a.unlocked).length} / {achievements.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Уровень:</span>
                    <span className="font-bold text-purple-400">15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Настройки профиля</h2>
                {!editMode && (
                  <Button onClick={() => setEditMode(true)} variant="outline">
                    <Icon name="Edit" size={18} className="mr-2" />
                    Редактировать
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Имя пользователя</label>
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    disabled={!editMode}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email</label>
                  <Input
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                {editMode && (
                  <div className="flex gap-4">
                    <Button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-600">
                      <Icon name="Save" size={18} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => {
                        setEditMode(false);
                        setNewUsername(username);
                        setNewEmail(email);
                      }}
                      variant="outline"
                    >
                      Отмена
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold mb-4">Изменить пароль</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Текущий пароль</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Новый пароль</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Подтвердите новый пароль</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button className="bg-green-500 hover:bg-green-600">
                  Изменить пароль
                </Button>
              </div>
            </div>

            <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl border-2 border-red-500 p-6">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-red-400">
                <Icon name="AlertTriangle" size={24} />
                Опасная зона
              </h2>
              <p className="text-gray-400 mb-4">Эти действия необратимы!</p>
              <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                Удалить аккаунт
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
