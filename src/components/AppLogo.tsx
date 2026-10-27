import React, { useState, useEffect } from 'react';

interface AppLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  subtitleText?: string;
  animated?: boolean;
  className?: string;
  glow?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'CINEMA VIP',
  animated = false,
  className = '',
  glow = true
}) => {
  // Dimension and typography presets
  const sizeConfig = {
    xs: { iconSize: 22, textClass: 'text-base tracking-tight', subClass: 'text-[8px] tracking-widest px-1 py-0.2' },
    sm: { iconSize: 28, textClass: 'text-lg tracking-tight', subClass: 'text-[9px] tracking-widest px-1.5 py-0.5' },
    md: { iconSize: 36, textClass: 'text-xl sm:text-2xl tracking-tighter', subClass: 'text-[10px] tracking-widest px-2 py-0.5' },
    lg: { iconSize: 48, textClass: 'text-3xl sm:text-4xl tracking-tighter', subClass: 'text-xs tracking-[0.25em] px-2.5 py-0.5' },
    xl: { iconSize: 64, textClass: 'text-4xl sm:text-5xl tracking-tighter', subClass: 'text-sm tracking-[0.3em] px-3 py-1' },
    hero: { iconSize: 84, textClass: 'text-5xl sm:text-6xl lg:text-7xl tracking-tighter', subClass: 'text-xs sm:text-sm tracking-[0.35em] px-4 py-1' }
  };

  const current = sizeConfig[size] || sizeConfig.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Luxury 3D Cinema Diamond Emblem */}
      <div
        className={`relative shrink-0 flex items-center justify-center ${
          animated ? 'animate-pulse hover:scale-105 transition-transform duration-500' : ''
        }`}
        style={{ width: current.iconSize, height: current.iconSize }}
      >
        {/* Ambient Glow Aura */}
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#e50914] via-[#ff2e3b] to-[#f59e0b] rounded-2xl blur-lg opacity-60 pointer-events-none transform -rotate-6 scale-110" />
        )}

        {/* Futuristic Cinema Clapper Emblem SVG */}
        <svg
          viewBox="0 0 100 100"
          className="relative z-10 w-full h-full drop-shadow-[0_4px_12px_rgba(229,9,20,0.6)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="45%" stopColor="#e50914" />
              <stop offset="85%" stopColor="#990000" />
              <stop offset="100%" stopColor="#550000" />
            </linearGradient>

            <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            <linearGradient id="logoGlossGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Diamond Shield Hexagon Base */}
          <path
            d="M50 4 L92 26 L92 74 L50 96 L8 74 L8 26 Z"
            fill="url(#logoPrimaryGrad)"
            stroke="url(#logoGoldGrad)"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Upper Clapperboard Slits (Anamorphic Stripes) */}
          <path
            d="M18 36 L30 24 L42 24 L30 36 Z"
            fill="url(#logoGoldGrad)"
          />
          <path
            d="M44 36 L56 24 L68 24 L56 36 Z"
            fill="url(#logoGoldGrad)"
          />
          <path
            d="M70 36 L82 24 L86 28 L74 36 Z"
            fill="url(#logoGoldGrad)"
          />

          {/* Film Strip Center Division Line */}
          <line
            x1="12"
            y1="38"
            x2="88"
            y2="38"
            stroke="url(#logoGoldGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Modern Geometric "F" Play-Crown Glyph */}
          <path
            d="M34 46 L68 46 C74 46 76 50 72 54 L52 74 L34 74 Z"
            fill="white"
            fillOpacity="0.95"
          />
          <polygon
            points="46,52 64,62 46,72"
            fill="#e50914"
          />

          {/* Gloss & Light Reflection Flare */}
          <path
            d="M50 7 L88 28 L50 50 L12 28 Z"
            fill="url(#logoGlossGrad)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Brand Wordmark & Tagline */}
      <div className="flex flex-col items-start leading-none text-right dir-ltr">
        <div className="flex items-center gap-1.5">
          <span className={`font-black uppercase tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${current.textClass}`}>
            <span className="text-white">FILM</span>
            <span className="bg-gradient-to-r from-[#ff3344] via-[#e50914] to-[#ff7b88] bg-clip-text text-transparent">
              MAX
            </span>
          </span>
        </div>

        {showSubtitle && (
          <div className="mt-0.5 flex items-center gap-1">
            <span
              className={`font-black rounded-md uppercase border border-amber-400/40 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)] ${current.subClass}`}
            >
              {subtitleText}
            </span>
            <span className="text-[8px] font-mono text-red-400/80 font-bold">4K HDR</span>
          </div>
        )}
      </div>
    </div>
  );
};
