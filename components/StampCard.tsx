
import React, { useState, useEffect } from 'react';
import { CoffeeCupIcon } from './CoffeeCupIcon';

interface StampCardProps {
  stamps: number;
  total: number;
  playAnimation?: boolean;
  onAnimationComplete?: () => void;
}

export const StampCard: React.FC<StampCardProps> = ({ stamps, total, playAnimation = false, onAnimationComplete = () => {} }) => {
  const [animatedStampCount, setAnimatedStampCount] = useState(stamps);

  useEffect(() => {
    if (!playAnimation) {
      setAnimatedStampCount(stamps);
      return;
    }

    // Start the animation sequence
    setAnimatedStampCount(0);
    let stampCounter = 0;
    const intervalId = setInterval(() => {
      stampCounter++;
      setAnimatedStampCount(stampCounter);
      if (stampCounter >= total) {
        clearInterval(intervalId);
        setTimeout(() => {
          onAnimationComplete();
        }, 600); // Wait for the final pop animation to mostly finish
      }
    }, 80);

    return () => clearInterval(intervalId);
  }, [playAnimation, stamps, total, onAnimationComplete]);

  const displayStamps = playAnimation ? animatedStampCount : stamps;
  
  return (
    <>
      <div className="grid grid-cols-5 gap-3 sm:gap-4 p-4 bg-brand-green-50 rounded-xl">
        {Array.from({ length: total }, (_, i) => (
          <CoffeeCupIcon 
            key={i} 
            filled={i < displayStamps}
            isFinal={playAnimation && i === total - 1 && displayStamps >= total}
          />
        ))}
      </div>
      <style>{`
        @keyframes final-stamp-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(10deg); box-shadow: 0 0 20px rgba(253, 250, 245, 0.9); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-final-stamp {
          animation: final-stamp-pop 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};
