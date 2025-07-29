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
  meta?: AchievementMeta;
}

export interface AchievementMeta {
  [key: string]: unknown;
}

export interface AchievementConfig {
  type: string;
  title: string;
  description: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
}
