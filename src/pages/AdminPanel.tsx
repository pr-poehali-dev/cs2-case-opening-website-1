import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
  totalSpent: number;
  casesOpened: number;
  status: 'active' | 'banned';
  registeredAt: string;
}

interface CaseItem {
  id: number;
  name: string;
  price: number;
  items: number;
  isActive: boolean;
  totalOpened: number;
  revenue: number;
}

const mockUsers: User[] = [
  { id: 1, username: 'player_2024', email: 'player@example.com', balance: 1250, totalSpent: 5420, casesOpened: 87, status: 'active', registeredAt: '2024-10-15' },
  { id: 2, username: 'cs2_pro', email: 'pro@example.com', balance: 450, totalSpent: 12300, casesOpened: 234, status: 'active', registeredAt: '2024-09-20' },
  { id: 3, username: 'lucky_guy', email: 'lucky@example.com', balance: 8900, totalSpent: 3200, casesOpened: 45, status: 'active', registeredAt: '2024-11-01' },
  { id: 4, username: 'cheater123', email: 'cheater@example.com', balance: 0, totalSpent: 120, casesOpened: 12, status: 'banned', registeredAt: '2024-10-28' },
];

const mockCases: CaseItem[] = [
  { id: 1, name: 'ЧУПАКАБРА', price: 29, items: 48, isActive: true, totalOpened: 1520, revenue: 44080 },
  { id: 2, name: 'ПИКОВАЯ ДАМА', price: 79, items: 47, isActive: true, totalOpened: 892, revenue: 70468 },
  { id: 3, name: 'БУГИМЕН', price: 149, items: 48, isActive: true, totalOpened: 445, revenue: 66305 },
  { id: 4, name: 'ДЖИНН', price: 499, items: 45, isActive: true, totalOpened: 187, revenue: 93313 },
  { id: 5, name: 'СЛЕНДЕР', price: 999, items: 47, isActive: false, totalOpened: 78, revenue: 77922 },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'cases' | 'promocodes' | 'settings'>('dashboard');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [cases, setCases] = useState<CaseItem[]>(mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoReward, setNewPromoReward] = useState('');

  const totalRevenue = cases.reduce((acc, c) => acc + c.revenue, 0);
  const totalCasesOpened = cases.reduce((acc, c) => acc + c.totalOpened, 0);
  const activeUsers = users.filter(u => u.status === 'active').length;

  const handleBanUser = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u));
  };

  const handleToggleCase = (caseId: number) => {
    setCases(cases.map(c => c.id === caseId ? { ...c, isActive: !c.isActive } : c));
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Админ-панель</h1>
            <p className="text-gray-400">Управление сайтом CASE🔥BATTLE</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500 text-white px-4 py-2 text-sm">
              <Icon name="Shield" size={16} className="mr-2" />
              Администратор
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="LayoutDashboard" size={18} />
            Панель
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Users" size={18} />
            Пользователи
          </Button>
          <Button
            variant={activeTab === 'cases' ? 'default' : 'outline'}
            onClick={() => setActiveTab('cases')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Package" size={18} />
            Кейсы
          </Button>
          <Button
            variant={activeTab === 'promocodes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('promocodes')}
            className="gap-2 whitespace-nowrap"
          >
            <Icon name="Ticket" size={18} />
            Промокоды
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

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-900/40 to-green-600/40 rounded-xl p-6 border-2 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-300">Общий доход</h3>
                  <Icon name="DollarSign" className="text-green-400" size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{totalRevenue.toLocaleString()} ₽</div>
                <p className="text-xs text-gray-400">+12% за месяц</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-600/40 rounded-xl p-6 border-2 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-300">Активных игроков</h3>
                  <Icon name="Users" className="text-blue-400" size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{activeUsers}</div>
                <p className="text-xs text-gray-400">Всего: {users.length}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/40 to-orange-600/40 rounded-xl p-6 border-2 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-300">Открыто кейсов</h3>
                  <Icon name="Package" className="text-orange-400" size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{totalCasesOpened}</div>
                <p className="text-xs text-gray-400">За всё время</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-purple-600/40 rounded-xl p-6 border-2 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm text-gray-300">Средний чек</h3>
                  <Icon name="TrendingUp" className="text-purple-400" size={24} />
                </div>
                <div className="text-3xl font-bold mb-1">{Math.round(totalRevenue / totalCasesOpened)} ₽</div>
                <p className="text-xs text-gray-400">На открытие</p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="TrendingUp" size={24} />
                Топ кейсов по доходу
              </h2>
              <div className="space-y-3">
                {cases.sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((caseItem, index) => (
                  <div key={caseItem.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-500">#{index + 1}</div>
                      <div>
                        <div className="font-bold">{caseItem.name}</div>
                        <div className="text-sm text-gray-400">Открыто: {caseItem.totalOpened} раз</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-400">{caseItem.revenue.toLocaleString()} ₽</div>
                      <div className="text-sm text-gray-400">Цена: {caseItem.price} ₽</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по имени или email..."
                className="max-w-md"
              />
              <Button variant="outline" className="gap-2">
                <Icon name="Download" size={18} />
                Экспорт
              </Button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Баланс</TableHead>
                    <TableHead>Потрачено</TableHead>
                    <TableHead>Кейсов</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-bold">{user.username}</TableCell>
                      <TableCell className="text-gray-400">{user.email}</TableCell>
                      <TableCell>{user.balance} ₽</TableCell>
                      <TableCell className="text-green-400">{user.totalSpent} ₽</TableCell>
                      <TableCell>{user.casesOpened}</TableCell>
                      <TableCell className="text-gray-400">{user.registeredAt}</TableCell>
                      <TableCell>
                        {user.status === 'active' ? (
                          <Badge className="bg-green-500">Активен</Badge>
                        ) : (
                          <Badge className="bg-red-500">Забанен</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBanUser(user.id)}
                          >
                            <Icon name={user.status === 'active' ? 'Ban' : 'CheckCircle'} size={16} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Edit" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button className="gap-2 bg-green-500 hover:bg-green-600">
                <Icon name="Plus" size={18} />
                Добавить кейс
              </Button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Предметов</TableHead>
                    <TableHead>Открыто раз</TableHead>
                    <TableHead>Доход</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell>{caseItem.id}</TableCell>
                      <TableCell className="font-bold">{caseItem.name}</TableCell>
                      <TableCell>{caseItem.price} ₽</TableCell>
                      <TableCell>{caseItem.items}</TableCell>
                      <TableCell>{caseItem.totalOpened}</TableCell>
                      <TableCell className="text-green-400">{caseItem.revenue.toLocaleString()} ₽</TableCell>
                      <TableCell>
                        {caseItem.isActive ? (
                          <Badge className="bg-green-500">Активен</Badge>
                        ) : (
                          <Badge className="bg-gray-500">Отключен</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleCase(caseItem.id)}
                          >
                            <Icon name={caseItem.isActive ? 'EyeOff' : 'Eye'} size={16} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'promocodes' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Создать новый промокод</h2>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">Код промокода</label>
                  <Input
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    placeholder="PROMO2024"
                    className="uppercase"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-400 mb-2 block">Награда (монеты)</label>
                  <Input
                    type="number"
                    value={newPromoReward}
                    onChange={(e) => setNewPromoReward(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать
                </Button>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4">Активные промокоды</h2>
              <div className="space-y-3">
                {['WELCOME100', 'LUCKY777', 'WEEKEND50', 'CS2PROMO', 'MEGABONUS'].map((code, index) => (
                  <div key={code} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <code className="text-xl font-bold text-orange-400 bg-slate-700/50 px-3 py-1 rounded">
                        {code}
                      </code>
                      <div>
                        <div className="text-sm text-gray-400">Использований: {Math.floor(Math.random() * 100)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold text-green-400">+{[100, 777, 50, 250, 500][index]}</div>
                      <Button size="sm" variant="outline">
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Settings" size={24} />
                Основные настройки
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Название сайта</label>
                  <Input defaultValue="CASE🔥BATTLE" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Слоган</label>
                  <Input defaultValue="У НАС ВЫИГРЫВАЮТ" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Минимальный баланс</label>
                  <Input type="number" defaultValue="0" />
                </div>
                <Button className="bg-green-500 hover:bg-green-600">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить изменения
                </Button>
              </div>
            </div>

            <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border-2 border-red-500">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-red-400">
                <Icon name="AlertTriangle" size={24} />
                Опасная зона
              </h2>
              <p className="text-gray-400 mb-4">Эти действия необратимы. Будьте осторожны!</p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  Очистить статистику
                </Button>
                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  Сбросить все балансы
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
