import { useEffect, useState, useCallback, createContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { AuthUser, AuthContextType } from '@/entities/habit/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const meta = data.session.user.user_metadata || {};
        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          name: meta.name || undefined,
          avatarUrl: meta.avatar_url || meta.avatarUrl || undefined,
        });
      }
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: meta.name || undefined,
          avatarUrl: meta.avatar_url || meta.avatarUrl || undefined,
        });
      } else {
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const signInWithGithub = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signInWithGithub }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
