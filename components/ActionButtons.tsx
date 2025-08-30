import type { Translations } from '../constants/translations';
import React from 'react';

interface ActionButtonsProps {
    stamps: number;
    total: number;
    onAddStamp: () => void;
    onClaimReward: () => void;
    t: Translations;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ stamps, total, onAddStamp, onClaimReward, t }) => {
    const isComplete = stamps >= total;

    return (
        <button
            onClick={isComplete ? onClaimReward : onAddStamp}
            disabled={isComplete && stamps > total} // Disable if logic were to allow over-stamping
            className={`w-full py-4 px-6 text-lg font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4
            ${isComplete 
                ? 'bg-yellow-400 text-brand-green-900 hover:bg-yellow-500 focus:ring-yellow-300' 
                : 'bg-brand-green-800 text-white hover:bg-brand-green-900 focus:ring-brand-green-300'
            }`}
        >
            {isComplete ? t.rewardReadyButton : t.addStampButton}
        </button>
    );
};