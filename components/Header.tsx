
import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { translations } from '../constants/translations';
import { Logo } from './Logo';

interface HeaderProps {
    language: 'kh' | 'en';
    toggleLanguage: () => void;
    username: string;
    onLogout?: () => void;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, toggleLanguage, username, onLogout, onBack }) => {
    const t = translations[language];
    const commonButtonClasses = "px-3 py-2 font-semibold bg-white text-brand-green-700 rounded-lg shadow-sm hover:bg-brand-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500";

    return (
        <header className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md mx-auto gap-2">
            <Logo />
            <div className="flex items-center gap-2 sm:gap-3 text-sm">
                 <div className="flex items-center bg-cream/20 backdrop-blur-sm border border-cream/30 text-cream rounded-full px-3 py-1.5 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span>
                        <span className="font-medium">{t.welcomeGreeting}</span>
                        <span className="font-bold"> {username}</span>
                    </span>
                </div>
                <LanguageSwitcher currentLanguage={language} onToggle={toggleLanguage} />
                {onBack ? (
                    <button 
                        onClick={onBack}
                        className={commonButtonClasses}
                        aria-label={t.backButton}
                    >
                        {t.backButton}
                    </button>
                ) : onLogout ? (
                     <button 
                        onClick={onLogout}
                        className={commonButtonClasses}
                        aria-label={t.logoutButton}
                    >
                        {t.logoutButton}
                    </button>
                ) : null}
            </div>
        </header>
    );
};
