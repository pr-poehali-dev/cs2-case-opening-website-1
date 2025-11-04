import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface RecentActivity {
  type: string;
  name: string;
  result: string;
  value: number;
  time: string;
}

interface Achievement {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface ProfileOverviewProps {
  recentActivity: RecentActivity[];
  achievements: Achievement[];
}

export default function ProfileOverview({ recentActivity, achievements }: ProfileOverviewProps) {
  return (
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
          <Icon name="Award" size={24} />
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
  );
}
