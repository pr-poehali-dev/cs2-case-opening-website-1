import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ProfileSettingsProps {
  username: string;
  email: string;
  tradeUrl?: string;
  onSaveTradeUrl: (url: string) => void;
}

export default function ProfileSettings({
  username,
  email,
  tradeUrl,
  onSaveTradeUrl,
}: ProfileSettingsProps) {
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [tradeUrlInput, setTradeUrlInput] = useState('');
  const [tradeUrlError, setTradeUrlError] = useState('');
  const [showTradeUrlSuccess, setShowTradeUrlSuccess] = useState(false);

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

    onSaveTradeUrl(tradeUrlInput);
    setTradeUrlError('');
    setShowTradeUrlSuccess(true);
    setTimeout(() => setShowTradeUrlSuccess(false), 3000);
  };

  return (
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
        <h2 className="text-xl font-bold mb-2 text-red-400">Опасная зона</h2>
        <p className="text-sm text-gray-400 mb-4">
          После удаления аккаунта все данные будут потеряны навсегда
        </p>
        <Button variant="destructive">Удалить аккаунт</Button>
      </div>
    </div>
  );
}
