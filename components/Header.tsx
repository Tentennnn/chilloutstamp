import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { translations } from '../constants/translations';

interface HeaderProps {
    title: string;
    language: 'kh' | 'en';
    toggleLanguage: () => void;
    username: string;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, language, toggleLanguage, username, onLogout }) => {
    const t = translations[language];
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md mx-auto gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-green-900">{title}</h1>
            <div className="flex items-center gap-2 sm:gap-3 text-sm">
                <span className="text-brand-green-800 font-semibold">{t.welcomeMessage(username)}</span>
                <LanguageSwitcher currentLanguage={language} onToggle={toggleLanguage} />
                <button 
                    onClick={onLogout}
                    className="px-3 py-2 font-semibold bg-white text-brand-green-700 rounded-lg shadow-sm hover:bg-brand-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
                    aria-label={t.logoutButton}
                >
                    {t.logoutButton}
                </button>
            </div>
        </header>
    );
};