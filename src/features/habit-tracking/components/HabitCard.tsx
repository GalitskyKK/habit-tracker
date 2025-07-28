import {
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  Percent,
  Target,
  Trash2,
} from 'lucide-react';

import { Progress } from '@/shared/ui/Progress';
import type { Habit, HabitRecord } from '@/entities/habit/types';
import { formatDate, getDateRange, getDayName } from '@/shared/utils/date';
import { Card } from '@/shared/ui/Card';
import { HabitHistoryModal } from './HabitHistoryModal';
import React, { useState } from 'react';

export const HabitCard: React.FC<{
  habit: Habit;
  records: HabitRecord[];
  streak: number;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (id: string) => void;
}> = ({ habit, records, streak, onToggle, onDelete }) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const dates = getDateRange(7);
  const today = formatDate(new Date());

  const getRecordForDate = (date: string) => {
    return records.find((r) => r.habitId === habit.id && r.date === date);
  };

  const completedDays = records.filter((r) => r.habitId === habit.id && r.completed).length;
  const progressPercentage = Math.floor((completedDays / habit.targetDays) * 100);

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

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setHistoryOpen(true)}
          className="ml-auto text-gray-500 hover:underline text-sm">
          <Calendar size={18} />
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

      <div className="flex justify-between">
        {dates.map((date) => {
          const record = getRecordForDate(date);
          const isCompleted = record?.completed ?? false;
          const isToday = date === today;

          return (
            <div key={date} className="flex flex-col items-center">
              <button
                onClick={() => onToggle(habit.id, date)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
                style={{
                  backgroundColor: isCompleted ? habit.color : 'transparent',
                  border: `2px solid ${isCompleted ? habit.color : '#E5E7EB'}`,
                }}>
                {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>
              <span className={`text-xs mt-1 ${isToday ? 'font-semibold' : ''}`}>
                {getDayName(date)}
              </span>
            </div>
          );
        })}
      </div>
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
