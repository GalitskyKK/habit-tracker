import React from 'react';
import type { Habit } from '@/entities/habit/types';
import { HabitCard } from '@/features/habit-tracking/components/HabitCard';
import type { HabitRecord } from '@/entities/habit/types';

interface HabitListProps {
  habits: Habit[];
  records: HabitRecord[];
  getHabitStreak: (habitId: string) => number;
  onToggle: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
}

const HabitListComponent: React.FC<HabitListProps> = ({
  habits,
  records,
  getHabitStreak,
  onToggle,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          records={records.filter((r) => r.habitId === habit.id)}
          streak={getHabitStreak(habit.id)}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export const HabitList = React.memo(HabitListComponent);

export default HabitList;
