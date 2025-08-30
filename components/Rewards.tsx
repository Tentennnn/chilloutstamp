import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { StampCard } from './StampCard';
import { RewardModal } from './RewardModal';
import { translations } from '../constants/translations';
import { DB_KEY } from '../App';

const getUserData = (username: string): { stamps: number, isRewardReady: boolean } => {
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      const db = JSON.parse(dbString);
      const userStamps = db.users[username]?.stamps ?? 0;
      return {
          stamps: userStamps,
          isRewardReady: userStamps >= 15,
      };
    }
  } catch (error) {
    console.error("Failed to parse user stamps from localStorage", error);
  }
  return { stamps: 0, isRewardReady: false };
};

const claimUserReward = (username: string) => {
  try {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
      const db = JSON.parse(dbString);
      if (db.users[username]) {
        db.users[username].stamps = 0; // Reset stamps after claiming
        localStorage.setItem(DB_KEY, JSON.stringify(db));
      }
    }
  } catch (error) {
    console.error("Failed to save user stamps to localStorage", error);
  }
};


interface RewardsProps {
  user: string;
  onLogout: () => void;
  initialLanguage: 'kh' | 'en';
  onLanguageChange: (lang: 'kh' | 'en') => void;
}

export const Rewards: React.FC<RewardsProps> = ({ user, onLogout, initialLanguage, onLanguageChange }) => {
  const [stamps, setStamps] = useState<number>(() => getUserData(user).stamps);
  const [language, setLanguage] = useState<'kh' | 'en'>(initialLanguage);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Periodically check for updates from localStorage, e.g., when an admin adds a stamp
    const interval = setInterval(() => {
        const data = getUserData(user);
        setStamps(data.stamps);
        if (data.isRewardReady) {
            setIsRewardModalOpen(true);
        }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);


  const startNewCard = () => {
    claimUserReward(user);
    setStamps(0);
    setIsRewardModalOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = language === 'kh' ? 'en' : 'kh';
    setLanguage(newLang);
    onLanguageChange(newLang);
  };

  const t = translations[language];
  const REWARD_GOAL = 15;

  return (
    <div className="w-full max-w-md mx-auto">
      <Header 
        language={language} 
        toggleLanguage={toggleLanguage} 
        title={t.title}
        username={user}
        onLogout={onLogout}
      />
      <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-green-800 mb-2">
          {t.progressText(stamps, REWARD_GOAL)}
        </h2>
        <p className="text-brand-green-600 mb-6">{t.instructions}</p>
        
        <StampCard 
          stamps={stamps} 
          total={REWARD_GOAL}
        />
      </main>
      <RewardModal 
        isOpen={isRewardModalOpen}
        onClose={startNewCard}
        t={t}
      />
    </div>
  );
};