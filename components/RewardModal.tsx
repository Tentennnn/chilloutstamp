import type { Translations } from '../constants/translations';
import React from 'react';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative transform transition-all scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fadeInScale 0.3s forwards' }}
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
          <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M19 3v4M3 10h18M12 14v4M8 18h8" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v-2.506M12 17.747v2.506M5.253 8H2.747M18.747 8h2.506M5.253 16H2.747M18.747 16h2.506" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-brand-green-900 mb-2">{t.rewardTitle}</h3>
        <p className="text-brand-green-700 mb-6">{t.rewardMessage}</p>
        <button
          onClick={onClose}
          className="w-full py-3 px-5 text-lg font-bold bg-brand-green-800 text-white rounded-xl hover:bg-brand-green-900 transition-colors focus:outline-none focus:ring-4 focus:ring-brand-green-300"
        >
          {t.startNewCardButton}
        </button>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
            animation: fadeInScale 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </div>
  );
};