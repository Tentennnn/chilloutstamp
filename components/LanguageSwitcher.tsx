import React from 'react';
import { translations } from '../constants/translations';

interface LanguageSwitcherProps {
    currentLanguage: 'kh' | 'en';
    onToggle: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, onToggle }) => {
    const buttonText = translations[currentLanguage].languageToggle;

    return (
        <button
            onClick={onToggle}
            className="px-3 py-2 text-sm font-semibold bg-white text-brand-green-700 rounded-lg shadow-sm hover:bg-brand-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500"
        >
            {buttonText}
        </button>
    );
};