import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInWithGithub } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fn = isRegister ? signUp : signIn;
    const { error } = await fn(email, password);
    setPending(false);
    if (error) {
      setError(error);
    } else {
      onClose();
      setEmail('');
      setPassword('');
      setError(null);
      setIsRegister(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setPassword('');
    setError(null);
    setIsRegister(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isRegister ? 'Регистрация' : 'Вход'}>
      <form onSubmit={handleAuth} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={setEmail} required />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={setPassword}
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 text-base">
          {pending ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
        </button>
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <button
          type="button"
          onClick={signInWithGithub}
          className="w-full inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-200 text-gray-900 hover:bg-blue-300 focus:ring-blue-400 px-4 py-2 text-base gap-2">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.371 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Sign in with GitHub
        </button>
        <div className="text-center text-sm">
          {isRegister ? (
            <>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => setIsRegister(false)}>
                Log in
              </button>
            </>
          ) : (
            <>
              Нет аккаунта?{' '}
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => setIsRegister(true)}>
                Sign in
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};
