import type { Habit, HabitRecord } from '@/entities/habit/types';
import { Card } from '@/shared/ui/Card';
import { formatDate, getDateRange } from '@/shared/utils/date';
import { TrendingUp } from 'lucide-react';

export const HabitStats: React.FC<{
  habits: Habit[];
  records: HabitRecord[];
}> = ({ habits, records }) => {
  if (habits.length === 0) return null;

  const totalHabits = habits.length;
  const todayRecords = records.filter((r) => r.date === formatDate(new Date()) && r.completed);
  const todayCompletionRate = totalHabits > 0 ? (todayRecords.length / totalHabits) * 100 : 0;

  const last7Days = getDateRange(7);
  const weeklyCompletions = last7Days.map(
    (date) => records.filter((r) => r.date === date && r.completed).length,
  );
  const avgWeeklyCompletion = weeklyCompletions.reduce((a, b) => a + b, 0) / 7;

  return (
    <Card className="p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-500" />
        Stats
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalHabits}</div>
          <div className="text-sm text-gray-600">Habits</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{todayCompletionRate.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{avgWeeklyCompletion.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Avg. per day</div>
        </div>
      </div>
    </Card>
  );
};
