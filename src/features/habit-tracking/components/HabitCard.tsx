import React from 'react';
import {
  CheckCircle2,
  Circle,
  Flame,
  Percent,
  Target,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Progress } from '@/shared/ui/Progress';
import type { Habit, HabitRecord } from '@/entities/habit/types';
import { formatDate } from '@/shared/utils/date';
import { Card } from '@/shared/ui/Card';
import { HabitHistoryModal } from './HabitHistoryModal';

function getDateRangeArray(start: Date, end: Date): string[] {
  const arr = [];
  const d = new Date(start);
  while (d <= end) {
    arr.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return arr;
}

export const HabitCard: React.FC<{
  habit: Habit;
  records: HabitRecord[];
  streak: number;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (id: string) => void;
}> = ({ habit, records, streak, onToggle, onDelete }) => {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [weekOffset, setWeekOffset] = React.useState(0);

  // Диапазон доступных дней для привычки
  const today = new Date();
  const habitStart = new Date(habit.createdAt);
  const habitEnd = new Date(habitStart);
  habitEnd.setDate(habitStart.getDate() + habit.targetDays - 1);
  const editableEnd = habitEnd < today ? habitEnd : today;
  const allEditableDates = getDateRangeArray(habitStart, editableEnd);

  // Разбиваем на недели
  const weeks: string[][] = [];
  for (let i = 0; i < allEditableDates.length; i += 7) {
    weeks.push(allEditableDates.slice(i, i + 7));
  }

  // Текущая неделя (последняя) + offset
  const currentWeekIndex = weeks.length - 1 + weekOffset;
  const visibleWeek = weeks[currentWeekIndex] || [];
  const todayStr = formatDate(today);

  // Ограничения для стрелок
  const canGoBack = currentWeekIndex > 0;
  const canGoForward = currentWeekIndex < weeks.length - 1;

  const getRecordForDate = (date: string) => {
    return records.find((r) => r.habitId === habit.id && r.date === date);
  };

  const completedDays = records.filter((r) => r.habitId === habit.id && r.completed).length;
  const progressPercentage = Math.floor((completedDays / habit.targetDays) * 100);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
          </div>
          {habit.description && <p className="text-sm text-gray-600">{habit.description}</p>}
        </div>
        <button onClick={() => onDelete(habit.id)} className="text-gray-400 hover:text-red-500 p-1">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Flame size={16} className="text-orange-500" />
          <span>{streak} days in a row</span>
        </div>
        <div className="flex items-center gap-1">
          <Target size={16} className="text-blue-500" />
          <span>
            {completedDays}/{habit.targetDays}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Percent size={16} className="text-blue-500" />
          <span>{progressPercentage}</span>
        </div>
      </div>

      <Progress value={completedDays} max={habit.targetDays} className="mb-3" />

      {/* Навигация по неделям */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          disabled={!canGoBack}
          className={`p-1 rounded transition-all duration-200 ${
            canGoBack
              ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 transform hover:scale-110'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Previous week">
          <ChevronLeft size={16} />
        </button>

        <div className="text-xs text-gray-500 transition-opacity duration-300">
          {visibleWeek.length > 0 && (
            <>
              {new Date(visibleWeek[0]).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
              })}{' '}
              —
              {new Date(visibleWeek[visibleWeek.length - 1]).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
              })}
            </>
          )}
        </div>

        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          disabled={!canGoForward}
          className={`p-1 rounded transition-all duration-200 ${
            canGoForward
              ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 transform hover:scale-110'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Next week">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Дни недели */}
      <div className="flex gap-2 justify-center mb-2">
        {visibleWeek.map((date, index) => {
          const record = getRecordForDate(date);
          const isCompleted = record?.completed ?? false;
          const isToday = date === todayStr;
          const jsDate = new Date(date);
          const weekDay = weekDays[jsDate.getDay()];

          let tooltip = '';
          if (isToday) tooltip = 'Today';
          else if (isCompleted) tooltip = 'Completed';
          else tooltip = 'Not completed';

          return (
            <div
              key={date}
              className="flex flex-col items-center"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.3s ease-out forwards',
              }}>
              <button
                onClick={() => onToggle(habit.id, date)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:shadow-md ${
                  isCompleted ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                } ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                style={{
                  backgroundColor: isCompleted ? habit.color : 'transparent',
                  border: `2px solid ${isCompleted ? habit.color : '#E5E7EB'}`,
                }}
                title={tooltip}>
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>
              <span
                className={`text-xs mt-1 transition-colors duration-200 ${
                  isToday ? 'font-semibold text-blue-600' : ''
                }`}>
                {weekDay}
              </span>
              <span className="text-[10px] text-gray-400 transition-colors duration-200">
                {date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setHistoryOpen(true)}
        className="ml-auto text-blue-500 text-m font-bold transition-colors duration-200 hover:text-blue-700 flex items-center gap-2 bg-blue-500/10 p-2 rounded-md">
        <Info size={24} />
        Information
      </button>
      <HabitHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        habit={habit}
        records={records}
        onToggle={onToggle}
      />
    </Card>
  );
};
