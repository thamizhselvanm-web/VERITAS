import React, { useEffect, useRef } from 'react';

const cardFrameUrls = Object.entries(
  import.meta.glob('../../veritas-card/*.jpg', { eager: true, query: '?url', import: 'default' })
).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, url]) => url as string);

export const SystemCardAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || cardFrameUrls.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preload images into memory
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    cardFrameUrls.forEach((url, idx) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
      };
      loadedImages[idx] = img;
    });
    imagesRef.current = loadedImages;

    // Canvas sizing
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Scroll & Mouse listeners for smooth interactive scrubbing
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = scrollHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollHeight)) : 0;
      targetFrameRef.current = Math.floor(scrollRatio * (cardFrameUrls.length - 1));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth render loop with lerp and ambient movement
    let ambientTick = 0;

    const render = () => {
      ambientTick += 0.05;

      // Calculate target frame including ambient tick if scroll is fixed
      const target = (targetFrameRef.current + Math.sin(ambientTick * 0.1) * 3) % cardFrameUrls.length;
      const normalizedTarget = (target + cardFrameUrls.length) % cardFrameUrls.length;

      // Smooth interpolation (lerp)
      const diff = normalizedTarget - currentFrameRef.current;
      currentFrameRef.current += diff * 0.08;

      const currentIdx = Math.min(
        cardFrameUrls.length - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const img = imagesRef.current[currentIdx];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (img && img.complete) {
        // Draw centered with mouse parallax scale and tilt
        const mouseX = (mousePosRef.current.x - 0.5) * 40;
        const mouseY = (mousePosRef.current.y - 0.5) * 40;

        const maxDim = Math.min(canvas.width, canvas.height) * 0.85;
        const aspect = img.naturalWidth / img.naturalHeight || 1.6;
        let drawWidth = maxDim;
        let drawHeight = maxDim / aspect;

        if (drawWidth > canvas.width * 0.75) {
          drawWidth = canvas.width * 0.75;
          drawHeight = drawWidth / aspect;
        }

        const x = (canvas.width - drawWidth) / 2 + mouseX;
        const y = (canvas.height - drawHeight) / 2 + mouseY;

        ctx.save();
        ctx.globalAlpha = 0.09; // Subtle continuous background card ambient presence
        ctx.shadowColor = '#E07A5F';
        ctx.shadowBlur = 30;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Canvas for ultra-smooth 3D card animation frame sequence */}
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Copper Coral Ambient Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#141211]/60 to-[#141211] pointer-events-none" />
    </div>
  );
};
