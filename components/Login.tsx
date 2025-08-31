
import React, { useState } from 'react';
import type { Translations } from '../constants/translations';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (username: string) => Promise<{ success: boolean; error?: string }>;
  t: Translations;
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, t, onBack }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoading(true);
      setError('');
      const result = await onLogin(username.trim().toLowerCase());
      setIsLoading(false);
      if (!result.success) {
        const errorMessage = result.error === 'network_error' ? t.networkError : t.userNotFoundError;
        setError(errorMessage);
        setTimeout(() => setError(''), 4000);
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-brand-green-600 mb-6">{t.loginInstructions}</p>
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
          {error && <p className="text-red-500 text-sm -mt-2 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 text-lg font-bold rounded-xl text-white bg-brand-green-800 hover:bg-brand-green-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300 disabled:bg-brand-green-600 disabled:cursor-wait"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.loggingIn}
              </span>
            ) : (
              t.loginButton
            )}
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
