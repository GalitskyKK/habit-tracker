import React, { useRef, useState } from 'react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router-dom';
import type { AuthUser } from '@/shared/hooks/useAuth';

export interface HeaderProps {
  setShowAuth: (v: boolean) => void;
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({ setShowAuth, user, loading, signOut }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <header className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 shadow/5 rounded-sm px-9 bg-white/80 backdrop-blur-md w-3/4">
      <div className="flex justify-between p-2 max-w-[1672px] items-center">
        <Link to="/">
          <div className="text-4xl font-semibold text-gray-300 p-1 rounded-sm hover:text-gray-500 duration-1000">
            HabitTracker
          </div>
        </Link>
        {loading ? null : user ? (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setOpen((v) => !v)}>
              <Avatar src={user.avatarUrl} alt={user.name || user.email} size={36} />
            </button>
            {open && (
              <div className="absolute right-0 mt-4 w-2xs flex flex-col gap-2 bg-white rounded-lg shadow-lg p-4 z-50 border border-blue-100">
                <div className="text-sm font-semibold text-gray-800">{user.name || user.email}</div>
                <div className="border-b"></div>
                <div>
                  <Button
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={() => {
                      setOpen(false);
                      navigate('/user');
                    }}>
                    Profile
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" onClick={signOut}>
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={() => setShowAuth(true)}>Log in / Sign in</Button>
        )}
      </div>
    </header>
  );
};
