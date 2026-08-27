import React from 'react';

interface VeritasLogoProps {
  variant?: 'full' | 'icon-only' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VeritasLogo: React.FC<VeritasLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = ''
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  const subSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Shield + Green Checkmark Icon Container */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
          {/* Dark Background Container */}
          <rect width="100" height="100" rx="24" fill="#0B0F19" />
          
          {/* Shield Outline */}
          <path 
            d="M50 16 C66 16 78 22 78 45 C78 66 64 79 50 85 C36 79 22 66 22 45 C22 22 34 16 50 16 Z" 
            stroke="#3B82F6" 
            strokeOpacity="0.5" 
            strokeWidth="3.5" 
            fill="none"
          />
          
          {/* Green Checkmark */}
          <path 
            d="M32 49 L46 63 L70 34" 
            stroke="#10B981" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {/* Typography Label */}
      {variant !== 'icon-only' && (
        <div className="whitespace-nowrap overflow-hidden">
          <span className={`font-sans font-extrabold ${titleSizes[size]} text-[#F8FAFC] tracking-wider block leading-none`}>
            VERITAS
          </span>
          <span className={`font-mono text-[#94A3B8] ${subSizes[size]} uppercase tracking-widest block mt-1`}>
            TRUST INTELLIGENCE PLATFORM
          </span>
        </div>
      )}
    </div>
  );
};
