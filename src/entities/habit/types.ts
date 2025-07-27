export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  targetDays: number;
}

export interface HabitRecord {
  habitId: string;
  date: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: string;
  date_earned: string;
  meta?: any;
}
