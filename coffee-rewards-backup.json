import React from 'react';

interface CoffeeCupIconProps {
  filled: boolean;
}

export const CoffeeCupIcon: React.FC<CoffeeCupIconProps> = ({ filled }) => {
  return (
    <div
      className={`aspect-square rounded-full flex items-center justify-center transition-colors duration-300 ${
        filled ? 'bg-brand-green-700 shadow-inner' : 'bg-brand-green-200'
      }`}
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
          d="M10 3a1 1 0 011 1v.5a.5.5 0 001 0V4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-.5a.5.5 0 000 1H15a1 1 0 011 1v5a4 4 0 01-4 4H8a4 4 0 01-4-4V8a1 1 0 011-1h1.5a.5.5 0 000-1H5a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011 1v.5a.5.5 0 001 0V4a1 1 0 011-1zM8 8v5a2 2 0 002 2h2a2 2 0 002-2V8H8z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
};