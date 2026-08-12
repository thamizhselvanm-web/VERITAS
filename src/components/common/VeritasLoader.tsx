import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

interface VeritasLoaderProps {
  onComplete?: () => void;
}

export const VeritasLoader: React.FC<VeritasLoaderProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'VERIFYING IDENTITY & PROVENANCE',
    'ANALYZING DOCUMENT INTELLIGENCE',
    'CORRELATING ENTITY RELATIONSHIP TOPOLOGY',
    'CALCULATING 3-PILLAR TRUST SCORE',
    'VERITAS READY'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        if (onComplete) setTimeout(onComplete, 400);
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#05070B] flex flex-col items-center justify-center font-sans select-none">
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-[#00F0FF] p-[1.5px] shadow-2xl shadow-cyan-500/30">
          <div className="w-full h-full bg-[#05070B] rounded-[14px] flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#00F0FF] animate-pulse" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white tracking-widest font-mono">VERITAS</h2>
          <p className="text-xs text-[#94A3B8] tracking-wider uppercase font-mono">Continuous Trust Intelligence</p>
        </div>

        {/* Dynamic Loading Text Sequence per Brief Sec 21 */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={stepIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-xs font-mono font-bold text-[#00F0FF] tracking-wider"
            >
              {steps[stepIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-48 bg-white/10 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-[#00F0FF]"
            initial={{ width: '0%' }}
            animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

      </motion.div>

    </div>
  );
};
