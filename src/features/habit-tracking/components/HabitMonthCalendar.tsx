import React from 'react';
import { DayPicker } from 'react-day-picker';
import type { Habit, HabitRecord } from '@/entities/habit/types';

interface HabitMonthCalendarProps {
  habit: Habit;
  records: HabitRecord[];
  onToggle: (habitId: string, date: string) => void;
}

export const HabitMonthCalendar: React.FC<HabitMonthCalendarProps> = ({
  habit,
  records,
  onToggle,
}) => {
  const completedDates = records
    .filter((r) => r.habitId === habit.id && r.completed)
    .map((r) => r.date);
  const allDates = records.filter((r) => r.habitId === habit.id).map((r) => r.date);
  const completedSet = new Set(completedDates);
  const allSet = new Set(allDates);
  const todayStr = new Date().toISOString().split('T')[0];
  const [month, setMonth] = React.useState(() => {
    if (records.length > 0) {
      return new Date(records[records.length - 1].date);
    }
    return new Date();
  });

  // Кастомизация дня
  const CustomDayButton = (
    props: React.ComponentProps<typeof import('react-day-picker').DayButton>,
  ) => {
    const dateStr = props.day.date.toISOString().split('T')[0];
    const isCompleted = completedSet.has(dateStr);
    const isAvailable = allSet.has(dateStr);
    const isToday = dateStr === todayStr;
    let bg = 'bg-gray-100';
    let text = 'text-gray-400';
    let border = '';
    let icon = null;
    let title = '';
    if (isCompleted) {
      bg = 'bg-green-500 hover:bg-green-600';
      text = 'text-white font-bold';
      icon = <span className="text-xs">✔️</span>;
      title = 'Выполнено';
    } else if (isAvailable) {
      bg = 'bg-red-100 hover:bg-red-200';
      text = 'text-red-500 font-semibold';
      icon = <span className="text-xs">—</span>;
      title = 'Не выполнено';
    } else {
      bg = 'bg-gray-50';
      text = 'text-gray-300';
      title = 'Нет записи';
    }
    if (isToday) {
      border = 'ring-2 ring-blue-400';
      title += ' (Сегодня)';
    }
    return (
      <button
        {...props}
        onClick={isAvailable ? () => onToggle(habit.id, dateStr) : undefined}
        disabled={!isAvailable}
        title={title}
        className={`w-12 h-12 m-0.5 rounded-lg flex flex-col items-center justify-center border-none outline-none transition-colors ${bg} ${text} ${border} select-none relative`}>
        {props.day.date.getDate()}
        <span className="absolute bottom-1 right-1">{icon}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <DayPicker
        month={month}
        onMonthChange={setMonth}
        components={{ DayButton: CustomDayButton }}
        showOutsideDays
        className="bg-white rounded-lg shadow p-2"
        classNames={{
          months: 'flex flex-col',
          month: 'flex flex-col',
          table: 'w-full',
          head_row: '',
          head_cell: 'text-xs text-gray-400 p-1',
          row: '',
          cell: 'p-0',
          day: '',
        }}
      />
    </div>
  );
};
