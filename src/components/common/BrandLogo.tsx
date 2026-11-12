import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'compact' | 'monochrome-white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  size = 'md'
}) => {
  const iconDimensions = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }[size];

  const textStyles = {
    sm: 'text-sm font-semibold tracking-tight',
    md: 'text-base font-semibold tracking-tight',
    lg: 'text-xl font-bold tracking-tight'
  }[size];

  // Original minimalist geometric leaf & furrow mark
  const LogoIcon = ({ isWhite = false }: { isWhite?: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconDimensions} shrink-0`}
    >
      {/* Precision geometric leaf silhouette with subtle agricultural furrow line */}
      <path
        d="M21 3C21 3 14 3.5 8.5 9C4.5 13 4 18 4 20C6 20 11 19.5 15 15.5C20.5 10 21 3 21 3Z"
        fill={isWhite ? 'currentColor' : '#193D25'}
      />
      <path
        d="M4 20L13.5 10.5"
        stroke={isWhite ? '#193D25' : '#F8F7F0'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.5 13.5L14 14"
        stroke={isWhite ? '#193D25' : '#F8F7F0'}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.5 10.5L14 7"
        stroke={isWhite ? '#193D25' : '#F8F7F0'}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'monochrome-white') {
    return (
      <div className={`flex items-center gap-2.5 text-white ${className}`}>
        <LogoIcon isWhite={true} />
        <span className={`${textStyles} font-serif tracking-normal text-white`}>
          TerraCrop <span className="font-sans font-light opacity-80 text-xs tracking-wider uppercase ml-0.5">AI</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon />
      <div className="flex items-baseline gap-1">
        <span className={`${textStyles} font-serif tracking-normal text-[#193D25]`}>
          TerraCrop
        </span>
        <span className="text-[11px] font-sans font-medium tracking-widest uppercase text-[#71966B]">
          AI
        </span>
      </div>
    </div>
  );
};
