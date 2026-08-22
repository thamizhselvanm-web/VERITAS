import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const loaderFrameUrls = Object.entries(
  import.meta.glob('../../veritas-card/*.jpg', { eager: true, query: '?url', import: 'default' })
).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, url]) => url as string);

interface VeritasLoaderProps {
  onComplete: () => void;
}

export const VeritasLoader: React.FC<VeritasLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    const totalFrames = loaderFrameUrls.length || 300;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2.5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        const frameIdx = Math.min(totalFrames - 1, Math.floor((next / 100) * totalFrames));
        setCurrentFrameIndex(frameIdx);
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  const currentFrameUrl = loaderFrameUrls[currentFrameIndex] || loaderFrameUrls[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#141211] text-[#F7F4F1] font-sans overflow-hidden select-none">
      
      {/* Ambient Copper Coral Background Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#E07A5F]/10 blur-[120px] pointer-events-none" />

      {/* 3D Card Animation Frame Preview */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-80 h-48 sm:w-96 sm:h-56 rounded-2xl border border-[#E07A5F]/30 bg-[#1C1816]/90 p-2 shadow-2xl shadow-[#E07A5F]/20 overflow-hidden flex items-center justify-center backdrop-blur-md"
      >
        {currentFrameUrl && (
          <img 
            src={currentFrameUrl} 
            alt="Veritas 3D Card" 
            className="w-full h-full object-contain filter contrast-110 saturate-110 opacity-90 transition-opacity duration-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211]/80 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Brand & Loading Info */}
      <div className="mt-8 text-center space-y-3 relative z-10 max-w-sm px-4">
        <h1 className="text-4xl text-[#F7F4F1] font-symphony tracking-wide">
          VERITAS <span className="text-[#E07A5F] font-mono text-xs tracking-widest uppercase ml-1">INTEL</span>
        </h1>
        
        <p className="text-xs text-[#D8C7B8] font-mono tracking-wide">
          INITIALIZING CONTINUOUS TRUST ENGINE...
        </p>

        {/* Copper Coral Progress Bar */}
        <div className="w-full bg-[#231E1B] h-1.5 rounded-full overflow-hidden border border-[#E07A5F]/20 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#B85235] via-[#E07A5F] to-[#F07151] rounded-full shadow-[0_0_12px_#E07A5F]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-[#9E8C7C] font-mono font-numeric pt-1">
          <span>FRAME {currentFrameIndex + 1} / {loaderFrameUrls.length || 300}</span>
          <span className="text-[#E07A5F] font-bold">{Math.round(progress)}%</span>
        </div>
      </div>

    </div>
  );
};
