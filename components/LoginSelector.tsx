import React from 'react';
import type { Translations } from '../constants/translations';
import { Logo } from './Logo';

interface LoginSelectorProps {
  onSelectUser: () => void;
  onSelectAdmin: () => void;
  t: Translations;
}

export const LoginSelector: React.FC<LoginSelectorProps> = ({ onSelectUser, onSelectAdmin, t }) => {
  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex flex-col gap-4">
          <button
            onClick={onSelectUser}
            className="w-full py-3 px-6 text-lg font-bold rounded-xl text-white bg-brand-green-800 hover:bg-brand-green-900 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300"
          >
            {t.userLoginPrompt}
          </button>
          <button
            onClick={onSelectAdmin}
            className="w-full py-3 px-6 text-lg font-bold rounded-xl text-brand-green-800 bg-brand-green-100 hover:bg-brand-green-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-green-300"
          >
            {t.adminLoginPrompt}
          </button>
        </div>
      </div>
    </div>
  );
};