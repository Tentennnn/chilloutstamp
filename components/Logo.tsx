import React from 'react';

export const Logo: React.FC = () => {
  return (
    <svg viewBox="0 0 160 40" height="40" aria-labelledby="logo-title">
      <title id="logo-title">CHILLOUT COFFEE Logo</title>
      <text
        x="80"
        y="22"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="#eee4c9"
        letterSpacing="0.05em"
        textAnchor="middle"
      >
        CHILLOUT
      </text>
      <text
        x="80"
        y="38"
        fontFamily="Poppins, sans-serif"
        fontSize="12"
        fontWeight="400"
        fill="#eee4c9"
        letterSpacing="0.2em"
        textAnchor="middle"
      >
        COFFEE
      </text>
    </svg>
  );
};
