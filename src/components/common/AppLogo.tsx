import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  withBorder?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 36,
  className = '',
  withBorder = false,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg overflow-hidden select-none ${
        withBorder ? 'border border-ink-700/60' : ''
      } ${className}`}
    >
      <img
        src="/crescent.svg"
        alt="Ramadan Companion Logo"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};

