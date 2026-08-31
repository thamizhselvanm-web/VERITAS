import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface SignatureCardSequenceProps {
  onComplete: () => void;
}

const cardFrameUrls = Object.entries(
  import.meta.glob('../../veritas-card/*.jpg', { eager: true, query: '?url', import: 'default' })
).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, url]) => url as string);

export const SignatureCardSequence: React.FC<SignatureCardSequenceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'animating' | 'docking'>('animating');
  const [stageMessage, setStageMessage] = useState('Initializing VERITAS Continuous Trust Engine…');
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload 3D Card Images into memory
  useEffect(() => {
    if (cardFrameUrls.length === 0) return;
    const loaded: HTMLImageElement[] = [];
    cardFrameUrls.forEach((url, idx) => {
      const img = new Image();
      img.src = url;
      loaded[idx] = img;
    });
    imagesRef.current = loaded;
  }, []);

  // 3D Card Animation Frame Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameIndex = 0;
    let animId: number;

    const render = () => {
      if (cardFrameUrls.length > 0 && imagesRef.current.length > 0) {
        frameIndex = (frameIndex + 1) % cardFrameUrls.length;
        const img = imagesRef.current[frameIndex];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (img && img.complete) {
          ctx.save();
          ctx.shadowColor = '#E07A5F';
          ctx.shadowBlur = 35;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const timer1 = setTimeout(() => {
      setStageMessage('Verifying Cryptographic Proofs & Identity…');
    }, 900);

    const timer2 = setTimeout(() => {
      setStageMessage('Loading Golden Intel Workspace…');
    }, 1800);

    const timer3 = setTimeout(() => {
      setPhase('docking');
    }, 2400);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div
      role="region"
      aria-label="VERITAS 3D Card Loading Animation"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0D10]/95 text-[#F7F4F1] select-none p-4 backdrop-blur-2xl font-sans"
    >
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 btn text-xs font-mono flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity"
      >
        <span>Skip Loading</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Header Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E07A5F]/15 border border-[#E07A5F]/40 text-[#E07A5F] text-xs font-mono font-bold shadow-lg shadow-[#E07A5F]/20">
        <ShieldCheck className="w-4 h-4 text-[#E07A5F]" />
        <span>VERITAS TRUST ENGINE</span>
      </div>

      {/* Prominent Center 3D Card Animation Frame Canvas ONLY */}
      <div
        className={`relative w-full max-w-lg aspect-[16/10] flex items-center justify-center transition-all duration-500 ease-out ${
          phase === 'docking' ? 'scale-90 opacity-0 -translate-y-8' : 'scale-100 opacity-100'
        }`}
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </div>

      {/* Stage Status Message */}
      <p className="text-xs font-mono text-[#D8C7B8] h-6 mt-6 tracking-wider uppercase text-center">
        {stageMessage}
      </p>

      {/* Progress Indicator Line */}
      <div className="w-full max-w-sm bg-[#1C1816] h-1.5 rounded-full overflow-hidden mt-3 border border-[#2E2A27]">
        <div
          className="h-full bg-[#4F46E5] transition-all duration-500 ease-linear"
          style={{
            width: phase === 'docking' ? '100%' : '75%',
          }}
        />
      </div>

    </div>
  );
};
