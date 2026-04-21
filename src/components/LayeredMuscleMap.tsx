'use client';

import React from 'react';
import { MuscleGroup } from '@/lib/muscle-mapping';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LayeredMuscleMapProps {
  intensities: Record<MuscleGroup, number>;
  className?: string;
}

/**
 * High-Fidelity Layered Image Mapping Component.
 * Uses a Stack of high-resolution PNGs to represent realistic anatomy.
 * Opacity of each muscle layer is bound to the 'trained score' from Firebase.
 */
export function LayeredMuscleMap({ intensities, className }: LayeredMuscleMapProps) {
  
  const frontLayers: { id: MuscleGroup; label: string }[] = [
    { id: 'peito', label: 'Peitorais' },
    { id: 'biceps', label: 'Bíceps' },
    { id: 'antebraco', label: 'Antebraço' },
    { id: 'core', label: 'Abdômen' },
    { id: 'quadriceps', label: 'Quadríceps' },
    { id: 'panturrilha', label: 'Panturrilhas' },
    { id: 'ombros', label: 'Deltoides' }
  ];

  const backLayers: { id: MuscleGroup; label: string }[] = [
    { id: 'costas', label: 'Dorsais/Trapézio' },
    { id: 'triceps', label: 'Tríceps' },
    { id: 'gluteos', label: 'Glúteos' },
    { id: 'isquios', label: 'Posteriores' },
    { id: 'panturrilha', label: 'Panturrilhas' },
    { id: 'ombros', label: 'Deltoides' }
  ];

  const renderBody = (side: 'front' | 'back', layers: typeof frontLayers) => {
    return (
      <div className="relative w-full aspect-[1/2.2] max-w-[320px] group">
        {/* Base Layer: High-resolution grey anatomy base */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`/assets/body_${side}_base.png`} 
            alt={`Base ${side}`}
            className="w-full h-full object-contain grayscale opacity-40"
            onError={(e) => {
              // Fallback for development if assets are missing
              (e.target as any).src = `https://picsum.photos/seed/anatomybase${side}/400/800`;
            }}
          />
        </div>

        {/* Muscle Layers (Overlays): Pre-rendered vibrant red/glow muscles */}
        {layers.map((layer) => {
          const score = intensities[layer.id] || 0;
          const opacity = score / 100; // Normalize 0-100 to 0.0-1.0
          
          return (
            <div 
              key={`${layer.id}-${side}`}
              className="absolute inset-0 z-10 transition-opacity duration-700 ease-in-out pointer-events-none"
              style={{ opacity: opacity }}
            >
              <img 
                src={`/assets/muscle_${layer.id}_${side}.png`} 
                alt={layer.label}
                className="w-full h-full object-contain"
                style={{ 
                  filter: `drop-shadow(0 0 8px rgba(255, 0, 0, ${opacity * 0.5}))` 
                }}
                onError={(e) => {
                  // Silently hide missing layers in development
                  (e.target as any).style.display = 'none';
                }}
              />
            </div>
          );
        })}

        {/* View Identification Label */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">
            {side === 'front' ? 'Vista Frontal' : 'Vista Posterior'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col items-center gap-20 w-full py-10", className)}>
      <div className="flex flex-row items-start justify-center gap-6 md:gap-24 w-full">
        {renderBody('front', frontLayers)}
        {renderBody('back', backLayers)}
      </div>

      {/* Legend as requested from image_6.png style */}
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-10 bg-black/40 px-10 py-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold text-muted-foreground uppercase">Baixo</span>
            <div className="w-12 h-2 rounded-full bg-zinc-800" />
          </div>
          
          <div className="flex gap-1.5">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
              <div 
                key={v} 
                className="w-8 h-2 rounded-full"
                style={{ 
                  backgroundColor: `rgba(255, 0, 0, ${v})`,
                  boxShadow: v > 0.6 ? `0 0 10px rgba(255, 0, 0, ${v * 0.5})` : 'none'
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            <span className="text-[12px] font-black text-primary uppercase italic">Alta</span>
          </div>
        </div>
        
        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] italic">
          High-Fidelity Anatomical Heatmap • Real-time Sync
        </p>
      </div>
    </div>
  );
}
