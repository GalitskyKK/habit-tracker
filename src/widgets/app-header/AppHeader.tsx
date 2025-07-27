import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Header } from '@/shared/ui/Header';
import { AuthModal } from '@/widgets/auth-modal/AuthModal';

export const AppHeader: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Header setShowAuth={setShowAuth} user={user} loading={loading} signOut={signOut} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};
