import React, { useState } from 'react';
import type { Translations } from '../constants/translations';
import { Logo } from './Logo';

interface AdminLoginProps {
  onLogin: (username: string) => void;
  t: Translations;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, t, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    // Simulate a network delay to make the loading state visible
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        onLogin(username);
      } else {
        setError('Invalid credentials.');
        setTimeout(() => setError(''), 3000);
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-brand-green-600 mb-6">{t.adminLoginInstructions}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.usernamePlaceholder}
            className="w-full px-4 py-3 border border-brand-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500 disabled:bg-gray-100"
            aria-label={t.usernamePlaceholder}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder}
            className="w-full px-4 py-3 border border-brand-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500 disabled:bg-gray-100"
            aria-label={t.passwordPlaceholder}
            required
            disabled={isLoading}
          />
           {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-lg font-bold rounded-xl text-white bg-brand-green-800 hover:bg-brand-green-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300 disabled:bg-brand-green-600 disabled:cursor-wait"
          >
            {isLoading ? t.loggingIn : t.adminLoginButton}
          </button>
           <button
            type="button"
            onClick={onBack}
            className="w-full py-2 mt-2 text-sm font-semibold text-brand-green-700 hover:underline disabled:opacity-50"
            disabled={isLoading}
          >
            {t.backButton}
          </button>
        </form>
      </div>
    </div>
  );
};