import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/shared/hooks/useAuth';
import type { Achievement, AchievementMeta, AchievementConfig } from '@/entities/habit/types';
import toast from 'react-hot-toast';

export const useAchievements = () => {
  const { user } = useAuth();

  // Получить все достижения пользователя
  const fetchAchievements = useCallback(async (): Promise<Achievement[]> => {
    if (!user) return [];
    const { data, error } = await supabase.from('achievements').select('*').eq('user_id', user.id);
    if (error) {
      toast.error('Ошибка загрузки достижений');
      return [];
    }
    return data || [];
  }, [user]);

  // Получить достижение по типу
  const getAchievementByType = useCallback(
    async (type: string): Promise<Achievement | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', type)
        .single();
      if (error || !data) return null;
      return data;
    },
    [user],
  );

  // Создать достижение, если его ещё нет, и показать тост
  const createAchievement = useCallback(
    async (type: string, meta?: AchievementMeta) => {
      if (!user) return;
      // Проверить, есть ли уже такое достижение
      const existing = await getAchievementByType(type);
      if (existing) return;
      const { data, error } = await supabase
        .from('achievements')
        .insert({ user_id: user.id, type, meta })
        .select()
        .single();
      if (!error && data) {
        const achievement = ACHIEVEMENTS.find((a) => a.type === type);
        const title = achievement ? achievement.title : type;
        toast.success(`🏆 ${title}`);
      }
    },
    [user, getAchievementByType],
  );

  return {
    fetchAchievements,
    createAchievement,
    getAchievementByType,
  };
};

export const ACHIEVEMENTS: AchievementConfig[] = [
  { type: 'first_habit', title: 'First Habit', description: 'Create your first habit' },
  { type: 'first_checkin', title: 'First Check-in', description: 'Complete your first habit day' },
  { type: 'streak_3', title: '3-Day Streak', description: 'Maintain a 3-day streak on any habit' },
  { type: 'streak_7', title: '7-Day Streak', description: 'Maintain a 7-day streak on any habit' },
  {
    type: 'streak_30',
    title: '30-Day Streak',
    description: 'Maintain a 30-day streak on any habit',
  },
  { type: 'five_habits', title: '5 Habits', description: 'Create 5 habits' },
  { type: 'ten_habits', title: '10 Habits', description: 'Create 10 habits' },
  {
    type: 'week_perfect',
    title: 'Perfect Week',
    description: 'Complete all habits every day for a week',
  },
  {
    type: 'month_perfect',
    title: 'Perfect Month',
    description: 'Complete all habits every day for a month',
  },
  {
    type: 'comeback',
    title: 'Comeback',
    description: 'Return after a 7+ day break and complete a habit',
  },
];
