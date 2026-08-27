import React from 'react';
import MoltenMetal from './MoltenMetal';

export const SystemCardAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#0B0D10]" aria-hidden="true">
      {/* Radiant Glowing Molten Metal / Liquid Steel WebGL Background */}
      <div className="absolute inset-0 opacity-100">
        <MoltenMetal
          color1="#D94E28"
          color2="#E07A5F"
          color3="#FFB703"
          speed={0.45}
          scale={2.6}
          detail={6}
          glow={3.8}
          coreSize={0.16}
          swirl={1.8}
          fold={-0.3}
          blackPoint={0.02}
          brightness={2.2}
          colorMode="ember"
          grain={true}
          grainIntensity={0.02}
          mouseInteraction={true}
          mouseStrength={0.5}
          opacity={0.95}
        />
      </div>

      {/* Shining Golden Core Highlight Aura */}
      <div className="absolute inset-0 bg-radial from-[#FFB703]/20 via-transparent to-[#0B0D10]/50 pointer-events-none" />

      {/* Subtle Grid Lines Overlay for Financial Tech Aesthetics */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(rgba(224, 122, 95, 0.4) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
