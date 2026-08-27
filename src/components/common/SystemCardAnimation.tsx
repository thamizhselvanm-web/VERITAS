import React from 'react';
import MoltenMetal from './MoltenMetal';

export const SystemCardAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0B0D10]" aria-hidden="true">
      {/* High-visibility Molten Metal / Liquid Steel WebGL Background */}
      <div className="absolute inset-0 opacity-75">
        <MoltenMetal
          color1="#B85235"
          color2="#E07A5F"
          color3="#F4A261"
          speed={0.3}
          scale={3.8}
          detail={4}
          glow={2.0}
          coreSize={0.12}
          swirl={1.2}
          fold={-0.25}
          blackPoint={0.04}
          brightness={1.4}
          colorMode="ember"
          grain={true}
          grainIntensity={0.04}
          mouseInteraction={true}
          mouseStrength={0.4}
          opacity={0.85}
        />
      </div>

      {/* Warm Golden Ambient Vignette Gradient */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0B0D10]/50 to-[#0B0D10]/90 pointer-events-none" />
    </div>
  );
};
