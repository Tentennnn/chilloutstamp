import React, { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { StampCard } from './StampCard';
import { RewardModal } from './RewardModal';
import { translations } from '../constants/translations';
import { getUser, upsertUser } from '../App';

interface RewardsProps {
  user: string;
  onLogout?: () => void;
  onBack?: () => void;
  initialLanguage: 'kh' | 'en';
  onLanguageChange: (lang: 'kh' | 'en') => void;
}

export const Rewards: React.FC<RewardsProps> = ({ user, onLogout, onBack, initialLanguage, onLanguageChange }) => {
  const [stamps, setStamps] = useState<number>(0);
  const [language, setLanguage] = useState<'kh' | 'en'>(initialLanguage);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);
  const [playFinishAnimation, setPlayFinishAnimation] = useState(false);
  const prevStampsRef = useRef(stamps);

  const REWARD_GOAL = 15;

  useEffect(() => {
    prevStampsRef.current = stamps;
  }, [stamps]);

  useEffect(() => {
    const fetchUserData = async () => {
        const userData = await getUser(user);
        if (userData) {
            setStamps(userData.stamps);
            if (prevStampsRef.current < REWARD_GOAL && userData.stamps >= REWARD_GOAL) {
                setPlayFinishAnimation(true);
            }
        }
    };

    fetchUserData();
    const interval = setInterval(fetchUserData, 2000); 

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  useEffect(() => {
    // Open modal if goal is met and we're not animating 
    // (e.g., on initial load of an already-completed card)
    if (stamps >= REWARD_GOAL && !playFinishAnimation) {
        setIsRewardModalOpen(true);
    }
  }, [stamps, playFinishAnimation]);

  const handleAnimationComplete = () => {
    setPlayFinishAnimation(false);
    setIsRewardModalOpen(true);
  };

  const startNewCard = async () => {
    const userData = await getUser(user);
    if (userData) {
      await upsertUser({ ...userData, stamps: 0 });
      setStamps(0);
      setIsRewardModalOpen(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'kh' ? 'en' : 'kh';
    setLanguage(newLang);
    onLanguageChange(newLang);
  };

  const t = translations[language];

  return (
    <div className="w-full max-w-md mx-auto">
      <Header 
        language={language} 
        toggleLanguage={toggleLanguage} 
        username={user}
        onLogout={onLogout}
        onBack={onBack}
      />
      <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-green-800 mb-2">
          {t.progressText(stamps, REWARD_GOAL)}
        </h2>
        <p className="text-brand-green-600 mb-6">{t.instructions}</p>
        
        <StampCard 
          stamps={stamps} 
          total={REWARD_GOAL}
          playAnimation={playFinishAnimation}
          onAnimationComplete={handleAnimationComplete}
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
