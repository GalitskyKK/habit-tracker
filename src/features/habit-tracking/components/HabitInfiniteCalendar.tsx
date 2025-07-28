import React, { useRef, useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import type { Habit, HabitRecord } from '@/entities/habit/types';

interface HabitInfiniteCalendarProps {
  habit: Habit;
  records: HabitRecord[];
  onToggle: (habitId: string, date: string) => void;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export const HabitInfiniteCalendar: React.FC<HabitInfiniteCalendarProps> = ({
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

  // Диапазон месяцев: [startOffset, endOffset] относительно текущего месяца
  const [startOffset, setStartOffset] = useState(-11); // 12 месяцев назад
  const [endOffset, setEndOffset] = useState(1); // до следующего месяца

  const containerRef = useRef<HTMLDivElement>(null);

  // Добавлять месяцы при скролле вверх/вниз
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.scrollTop < 100) {
      setStartOffset((prev) => prev - 3); // добавить 3 месяца вверх
    }
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      setEndOffset((prev) => prev + 3); // добавить 3 месяца вниз
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Массив месяцев для рендера
  const months: Date[] = [];
  for (let i = startOffset; i <= endOffset; i++) {
    months.push(addMonths(new Date(), i));
  }

  return (
    <div ref={containerRef} className="h-[70vh] w-full overflow-y-auto flex flex-col items-center">
      {months.map((monthDate) => (
        <div key={monthDate.toISOString()} className="mb-8 w-full flex flex-col items-center">
          <div className="text-center text-base font-semibold mb-2">
            {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <DayPicker
            month={monthDate}
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
      ))}
    </div>
  );
};
