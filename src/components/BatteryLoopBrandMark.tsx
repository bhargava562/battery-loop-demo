import React from 'react';

interface BatteryLoopBrandMarkProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

export const BatteryLoopBrandMark: React.FC<BatteryLoopBrandMarkProps> = ({
  size = 28,
  color = '#FFFFFF',
  accentColor = 'var(--accent-highlight, #D5F36A)',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0 }}
      aria-label="BatteryLoop Logo"
    >
      {/* Battery Terminal Cap */}
      <rect x="12" y="2" width="8" height="2.5" rx="1.25" fill={color} opacity={0.9} />

      {/* Battery Outer Shell */}
      <rect
        x="5"
        y="5.5"
        width="22"
        height="24.5"
        rx="4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Continuous Loop / Circular Economy Motif */}
      {/* Top right arc with directional arrow */}
      <path
        d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16"
        stroke={accentColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Bottom left arc with directional return */}
      <path
        d="M22 19C22 22.3137 19.3137 25 16 25C12.6863 25 10 22.3137 10 19"
        stroke={accentColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Arrows indicating the circular loop */}
      <path
        d="M20.5 14L22.5 16.5L24 14"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 21L9.5 18.5L8 21"
        stroke={accentColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central energy pulse point */}
      <circle cx="16" cy="17.5" r="1.5" fill={color} />
    </svg>
  );
};
