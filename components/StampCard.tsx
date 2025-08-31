import React from 'react';
import { CoffeeCupIcon } from '../CoffeeCupIcon';

interface StampCardProps {
  stamps: number;
  total: number;
}

export const StampCard: React.FC<StampCardProps> = ({ stamps, total }) => {
  return (
    <div className="grid grid-cols-5 gap-3 sm:gap-4 p-4 bg-brand-green-50 rounded-xl">
      {Array.from({ length: total }, (_, i) => (
        <CoffeeCupIcon 
          key={i} 
          filled={i < stamps}
        />
      ))}
    </div>
  );
};