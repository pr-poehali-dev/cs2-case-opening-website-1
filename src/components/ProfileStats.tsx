interface ProfileStatsProps {
  totalWinnings: number;
  totalSpent: number;
  casesOpened: number;
  biggestWin: number;
  registeredDate: string;
}

export default function ProfileStats({
  totalWinnings,
  totalSpent,
  casesOpened,
  biggestWin,
  registeredDate,
}: ProfileStatsProps) {
  return (
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
              <span className="text-gray-400">Открыто кейсов:</span>
              <span className="font-bold">{casesOpened}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Лучший выигрыш:</span>
              <span className="font-bold text-yellow-400">{biggestWin.toLocaleString()} ₽</span>
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
              <span className="text-gray-400">Статус:</span>
              <span className="font-bold text-green-400">Активен</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Верификация:</span>
              <span className="font-bold text-blue-400">Подтвержден</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Уровень:</span>
              <span className="font-bold text-purple-400">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Опыт:</span>
              <span className="font-bold">2,450 XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold mb-4">График активности</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[45, 82, 67, 91, 55, 78, 88, 72, 95, 63, 85, 77].map((height, index) => (
            <div key={index} className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg relative group hover:from-orange-400 hover:to-orange-200 transition-all" style={{ height: `${height}%` }}>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {height}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-400">
          <span>Янв</span>
          <span>Фев</span>
          <span>Мар</span>
          <span>Апр</span>
          <span>Май</span>
          <span>Июн</span>
          <span>Июл</span>
          <span>Авг</span>
          <span>Сен</span>
          <span>Окт</span>
          <span>Ноя</span>
          <span>Дек</span>
        </div>
      </div>
    </div>
  );
}
