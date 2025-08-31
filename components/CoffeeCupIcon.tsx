
import React from 'react';

interface CoffeeCupIconProps {
  filled: boolean;
  isFinal?: boolean;
}

export const CoffeeCupIcon: React.FC<CoffeeCupIconProps> = ({ filled, isFinal = false }) => {
  return (
    <div
      className={`aspect-square rounded-full flex items-center justify-center transition-colors duration-300 ${
        filled ? 'bg-brand-green-700 shadow-inner' : 'bg-brand-green-200'
      } ${isFinal ? 'animate-final-stamp' : ''}`}
    >
      <svg
        className={`w-2/3 h-2/3 transition-colors duration-300 ${
          filled ? 'text-cream' : 'text-brand-green-400'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9.5 2v4h1V2h-1zM5 5h10v2H5V5zM6 7l1.5 10h5L14 7H6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};
