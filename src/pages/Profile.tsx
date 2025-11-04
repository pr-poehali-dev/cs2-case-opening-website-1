import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useInventory } from '@/contexts/InventoryContext';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileProps {
  username: string;
  email: string;
  balance: number;
  steamId?: string;
  avatar?: string;
  tradeUrl?: string;
  onLogout: () => void;
  onSellItem: (price: number) => void;
  onUseInContract: (itemId: string) => void;
  onUseInUpgrade: (itemId: string) => void;
  onWithdrawItem: (itemId: string) => void;
}

export default function Profile({ username, email, balance, steamId, avatar, tradeUrl, onLogout, onSellItem, onUseInContract, onUseInUpgrade, onWithdrawItem }: ProfileProps) {
  const { items, removeItem } = useInventory();
  const { user, setTradeUrl } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings' | 'inventory'>('overview');
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [tradeUrlInput, setTradeUrlInput] = useState('');
  const [tradeUrlError, setTradeUrlError] = useState('');
  const [showTradeUrlSuccess, setShowTradeUrlSuccess] = useState(false);
  const [showTradeUrlReminder, setShowTradeUrlReminder] = useState(false);

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

  const validateTradeUrl = (url: string): boolean => {
    const tradeUrlPattern = /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=[a-zA-Z0-9_-]+$/;
    return tradeUrlPattern.test(url);
  };

  const handleSaveTradeUrl = () => {
    if (!tradeUrlInput.trim()) {
      setTradeUrlError('Введите Trade URL');
      return;
    }

    if (!validateTradeUrl(tradeUrlInput)) {
      setTradeUrlError('Неверный формат Trade URL. Пример: https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh');
      return;
    }

    setTradeUrl(tradeUrlInput);
    setTradeUrlError('');
    setShowTradeUrlSuccess(true);
    setTimeout(() => setShowTradeUrlSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
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
            variant={activeTab === 'inventory' ? 'default' : 'outline'}
            onClick={() => setActiveTab('inventory')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Package" size={18} />
            Инвентарь
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

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Мой инвентарь</h2>
                  <p className="text-sm text-gray-400">
                    Всего предметов: {items.length} • Общая стоимость: {items.reduce((sum, item) => sum + item.price, 0)} ₽
                  </p>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold mb-2">Инвентарь пуст</h3>
                  <p className="text-gray-400">Откройте кейсы, чтобы получить предметы</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((item) => {
                    const rarityColors = {
                      common: 'from-gray-600 to-gray-800 border-gray-500',
                      rare: 'from-blue-600 to-blue-800 border-blue-500',
                      epic: 'from-purple-600 to-purple-800 border-purple-500',
                      legendary: 'from-orange-600 to-orange-800 border-orange-500',
                    };
                    
                    const rarityNames = {
                      common: 'Обычная',
                      rare: 'Редкая',
                      epic: 'Эпическая',
                      legendary: 'Легендарная',
                    };

                    return (
                      <div
                        key={item.id}
                        className={`bg-gradient-to-br ${rarityColors[item.rarity]} border-2 rounded-lg p-4 relative hover:scale-105 transition-transform`}
                      >
                        <Badge className="absolute top-2 right-2 bg-black/80 text-white border-0 text-xs">
                          {item.caseName}
                        </Badge>

                        <div className="aspect-square mb-4 flex items-center justify-center">
                          <div className="text-6xl">{item.icon}</div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-bold text-sm">{item.name}</h3>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">{rarityNames[item.rarity]}</span>
                            <span className="font-bold text-green-400">{item.price} ₽</span>
                          </div>

                          <div className="flex gap-1 pt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-8 px-2 hover:bg-blue-500/20 hover:border-blue-500 border border-transparent"
                              title="Использовать в контракте"
                              onClick={() => onUseInContract(item.id)}
                            >
                              <Icon name="Layers" size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-8 px-2 hover:bg-purple-500/20 hover:border-purple-500 border border-transparent"
                              title="Использовать в апгрейде"
                              onClick={() => onUseInUpgrade(item.id)}
                            >
                              <Icon name="TrendingUp" size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-8 px-2 hover:bg-green-500/20 hover:border-green-500 border border-transparent"
                              title="Продать"
                              onClick={() => {
                                onSellItem(item.price);
                                removeItem(item.id);
                              }}
                            >
                              <Icon name="DollarSign" size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-8 px-2 hover:bg-orange-500/20 hover:border-orange-500 border border-transparent"
                              title="Вывести в Steam"
                              onClick={() => {
                                if (!user?.tradeUrl) {
                                  setShowTradeUrlReminder(true);
                                } else {
                                  onWithdrawItem(item.id);
                                  removeItem(item.id);
                                }
                              }}
                            >
                              <Icon name="Send" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {showTradeUrlReminder && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTradeUrlReminder(false)}>
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon name="AlertCircle" size={28} className="text-orange-400" />
                    <h3 className="text-xl font-bold">Trade URL не привязан</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Для вывода предметов необходимо привязать Steam Trade URL в настройках профиля.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowTradeUrlReminder(false);
                        setActiveTab('settings');
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <Icon name="Settings" size={18} className="mr-2" />
                      Перейти в настройки
                    </Button>
                    <Button
                      onClick={() => setShowTradeUrlReminder(false)}
                      variant="outline"
                    >
                      Позже
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Link" size={24} />
                Steam Trade URL
              </h2>
              {tradeUrl ? (
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={24} className="text-green-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="font-bold text-green-400 mb-2">Trade URL успешно привязан</p>
                        <p className="text-sm text-gray-300 break-all">{tradeUrl}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300">
                        Trade URL привязан навсегда и не может быть изменен. Выигранные скины будут отправлены на этот адрес.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="AlertCircle" size={24} className="text-orange-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-orange-400 mb-2">Привяжите Trade URL для вывода скинов</p>
                        <p className="text-sm text-gray-300 mb-3">
                          Trade URL можно привязать только один раз и изменить его будет невозможно.
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p className="font-semibold">Как получить Trade URL:</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Откройте настройки Steam → <a href="https://steamcommunity.com/my/tradeoffers/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Trade URL страница</a></li>
                            <li>Скопируйте вашу Trade Offer URL</li>
                            <li>Вставьте ссылку в поле ниже</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block font-semibold">
                      Введите ваш Steam Trade URL
                    </label>
                    <Input
                      value={tradeUrlInput}
                      onChange={(e) => {
                        setTradeUrlInput(e.target.value);
                        setTradeUrlError('');
                      }}
                      placeholder="https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh"
                      className={tradeUrlError ? 'border-red-500' : ''}
                    />
                    {tradeUrlError && (
                      <p className="text-sm text-red-400 mt-2 flex items-start gap-2">
                        <Icon name="XCircle" size={16} className="flex-shrink-0 mt-0.5" />
                        {tradeUrlError}
                      </p>
                    )}
                    {showTradeUrlSuccess && (
                      <p className="text-sm text-green-400 mt-2 flex items-center gap-2">
                        <Icon name="CheckCircle" size={16} />
                        Trade URL успешно сохранен!
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleSaveTradeUrl}
                    className="bg-green-500 hover:bg-green-600 w-full"
                  >
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить Trade URL навсегда
                  </Button>

                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="AlertTriangle" size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-300">
                        <span className="font-bold">Внимание!</span> После сохранения Trade URL невозможно изменить. Убедитесь, что ссылка правильная.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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