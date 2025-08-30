import React, { useState } from 'react';
import type { Translations } from '../constants/translations';

interface AdminLoginProps {
  onLogin: (username: string) => void;
  t: Translations;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, t, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a secure API call.
    if (username.toLowerCase() === 'admin' && password === 'admin123') {
      onLogin(username);
    } else {
      setError('Invalid credentials.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-brand-green-800 mb-2">{t.adminLoginTitle}</h1>
        <p className="text-brand-green-600 mb-6">{t.adminLoginInstructions}</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t.usernamePlaceholder}
            className="w-full px-4 py-3 border border-brand-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            aria-label={t.usernamePlaceholder}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder}
            className="w-full px-4 py-3 border border-brand-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green-500"
            aria-label={t.passwordPlaceholder}
            required
          />
           {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-6 text-lg font-bold rounded-xl text-white bg-brand-green-800 hover:bg-brand-green-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300"
          >
            {t.adminLoginButton}
          </button>
           <button
            type="button"
            onClick={onBack}
            className="w-full py-2 mt-2 text-sm font-semibold text-brand-green-700 hover:underline"
          >
            {t.backButton}
          </button>
        </form>
      </div>
    </div>
  );
};