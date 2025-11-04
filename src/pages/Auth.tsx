import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AuthProps {
  onLogin: (username: string, email: string) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Заполните все поля');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    onLogin(username, email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-neon-orange mb-2">CASE🔥BATTLE</div>
          <p className="text-gray-400 text-lg">У НАС ВЫИГРЫВАЮТ</p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border-2 border-slate-700 p-8 shadow-2xl">
          <div className="flex gap-2 mb-6">
            <Button
              variant={isLogin ? 'default' : 'outline'}
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className="flex-1"
            >
              Вход
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'outline'}
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className="flex-1"
            >
              Регистрация
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Имя пользователя</label>
              <div className="relative">
                <Icon name="User" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Введите имя"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email</label>
              <div className="relative">
                <Icon name="Mail" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Пароль</label>
              <div className="relative">
                <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Подтвердите пароль</label>
                <div className="relative">
                  <Icon name="Lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 flex items-center gap-2">
                <Icon name="AlertCircle" className="text-red-400" size={20} />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-6 text-lg font-bold"
            >
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-gray-400">или войти через</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <Icon name="Chrome" size={20} />
                Google
              </Button>
              <Button variant="outline" className="gap-2">
                <Icon name="Github" size={20} />
                GitHub
              </Button>
            </div>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                Забыли пароль?
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
}
