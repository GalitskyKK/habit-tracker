import { useCallback, useEffect, useState } from 'react';
import type { Habit, HabitRecord } from '../../../entities/habit/types';
import { formatDate } from '../../../shared/utils/date';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/shared/hooks/useAuth';
import { useAchievements } from './useAchievements';

interface UseHabitsResult {
  habits: Habit[];
  records: HabitRecord[];
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabit: (habitId: string, date: string) => Promise<void>;
  getHabitStreak: (habitId: string) => number;
  loading: boolean;
  error: string | null;
}

export const useHabits: () => UseHabitsResult = () => {
  const { user } = useAuth();
  const { createAchievement } = useAchievements();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных при смене пользователя
  useEffect(() => {
    if (!user) {
      setHabits([]);
      setRecords([]);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      // habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);
      // records
      const { data: recordsData, error: recordsError } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', user.id);
      if (habitsError || recordsError) {
        setError(habitsError?.message || recordsError?.message || 'Ошибка загрузки');
      } else {
        setHabits(
          (habitsData || []).map((h) => ({
            id: h.id,
            name: h.name,
            description: h.description,
            color: h.color,
            createdAt: h.created_at,
            targetDays: h.target_days,
          })),
        );
        setRecords(
          (recordsData || []).map((r) => ({
            habitId: r.habit_id,
            date: r.date,
            completed: r.completed,
          })),
        );
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // Добавить привычку
  const addHabit: (habit: Omit<Habit, 'id'>) => Promise<void> = useCallback(
    async (habit) => {
      if (!user) return;
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habit.name,
          description: habit.description,
          color: habit.color,
          target_days: habit.targetDays,
          created_at: habit.createdAt, // используем локальную дату
        })
        .select()
        .single();
      if (!error && data) {
        setHabits((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            description: data.description,
            color: data.color,
            createdAt: habit.createdAt, // используем локальную дату
            targetDays: data.target_days,
          },
        ]);
        // ACHIEVEMENTS: first_habit, five_habits, ten_habits
        if (habits.length === 0) createAchievement('first_habit');
        if (habits.length + 1 === 5) createAchievement('five_habits');
        if (habits.length + 1 === 10) createAchievement('ten_habits');
      }
    },
    [user, habits, createAchievement],
  );

  // Удалить привычку и все её records
  const deleteHabit: (id: string) => Promise<void> = useCallback(
    async (id) => {
      if (!user) return;
      await supabase.from('habits').delete().eq('id', id).eq('user_id', user.id);
      await supabase.from('records').delete().eq('habit_id', id).eq('user_id', user.id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setRecords((prev) => prev.filter((r) => r.habitId !== id));
    },
    [user],
  );

  // streak как раньше
  const getHabitStreak: (habitId: string) => number = useCallback(
    (habitId) => {
      const habitRecords = records
        .filter((r) => r.habitId === habitId && r.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let streak = 0;
      const currentDate = new Date();
      for (let i = 0; i < 30; i++) {
        const dateStr = formatDate(currentDate);
        const hasRecord = habitRecords.some((r) => r.date === dateStr);
        if (hasRecord) {
          streak++;
        } else if (streak > 0) {
          break;
        }
        currentDate.setDate(currentDate.getDate() - 1);
      }
      return streak;
    },
    [records],
  );

  // Переключить выполнение привычки на дату
  const toggleHabit: (habitId: string, date: string) => Promise<void> = useCallback(
    async (habitId, date) => {
      if (!user) return;
      const { data: existing } = await supabase
        .from('records')
        .select('*')
        .eq('user_id', user.id)
        .eq('habit_id', habitId)
        .eq('date', date)
        .single();
      if (existing) {
        // Инвертировать completed
        await supabase
          .from('records')
          .update({ completed: !existing.completed })
          .eq('id', existing.id);
        setRecords((prev) =>
          prev.map((r) =>
            r.habitId === habitId && r.date === date ? { ...r, completed: !r.completed } : r,
          ),
        );
      } else {
        // Добавить новый record
        const { data: newRec } = await supabase
          .from('records')
          .insert({
            user_id: user.id,
            habit_id: habitId,
            date,
            completed: true,
          })
          .select()
          .single();
        if (newRec) {
          setRecords((prev) => [
            ...prev,
            { habitId: newRec.habit_id, date: newRec.date, completed: newRec.completed },
          ]);
          // ACHIEVEMENTS: first_checkin
          if (records.length === 0) createAchievement('first_checkin');
          // streak achievements
          const streak = getHabitStreak(habitId) + 1; // +1, т.к. запись появится после setRecords
          if (streak === 3) createAchievement('streak_3');
          if (streak === 7) createAchievement('streak_7');
          if (streak === 30) createAchievement('streak_30');
        }
      }
    },
    [user, records, getHabitStreak, createAchievement],
  );

  return {
    habits,
    records,
    addHabit,
    deleteHabit,
    toggleHabit,
    getHabitStreak,
    loading,
    error,
  };
};
