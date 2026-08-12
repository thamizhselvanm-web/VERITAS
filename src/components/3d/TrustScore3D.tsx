import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TrustScore3DProps {
  score: number;
  label?: string;
  riskLevel?: string;
  size?: number;
}

export const TrustScore3D: React.FC<TrustScore3DProps> = ({
  score = 82,
  label = 'TRUST SCORE',
  riskLevel = 'MODERATE',
  size = 180
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  // Easing score count-up animation (0 -> 35 -> 61 -> 74 -> 82) per Brief Sec 9
  useEffect(() => {
    let current = 0;
    const duration = 1200; // 1.2s easing
    const steps = 30;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += Math.ceil(score / steps);
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return { stroke: '#3FB950', glow: 'rgba(63, 185, 80, 0.3)', badge: 'spatial-badge-verified' };
    if (s >= 60) return { stroke: '#D29922', glow: 'rgba(210, 153, 34, 0.3)', badge: 'spatial-badge-review' };
    return { stroke: '#F85149', glow: 'rgba(248, 81, 73, 0.3)', badge: 'spatial-badge-risk' };
  };

  const styleTheme = getColor(score);

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2 font-sans">
      
      {/* Outer Radial Energy Ring */}
      <div 
        className="relative flex items-center justify-center rounded-full transition-all duration-700"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: `0 0 40px ${styleTheme.glow}`
        }}
      >
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="8"
            fill="transparent"
          />

          {/* Animated Progress Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={styleTheme.stroke}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Score Visual Focus */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            className="text-5xl font-extrabold font-mono font-numeric text-white tracking-tight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayScore}
          </motion.span>
          <span className="text-[10px] font-mono font-bold text-[#94A3B8] tracking-widest uppercase mt-0.5">
            {label}
          </span>
        </div>

        {/* Particle Orbit Highlights */}
        <div 
          className="absolute w-2.5 h-2.5 rounded-full animate-ping pointer-events-none"
          style={{ backgroundColor: styleTheme.stroke }}
        />
      </div>

      {/* Trust Status Badge */}
      <div className="mt-3">
        <span className={`spatial-badge ${styleTheme.badge} text-xs px-3 py-1`}>
          {riskLevel} TRUST
        </span>
      </div>

    </div>
  );
};
