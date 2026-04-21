
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
 * Componente que utiliza o método Layered Image Mapping.
 * Empilha imagens transparentes de cada músculo sobre uma base cinza.
 */
export function LayeredMuscleMap({ intensities, className }: LayeredMuscleMapProps) {
  
  // Definição das camadas para facilitar a renderização
  const frontLayers: { id: MuscleGroup; label: string }[] = [
    { id: 'peito', label: 'Peitorais' },
    { id: 'biceps', label: 'Bíceps' },
    { id: 'antebraco', label: 'Antebraço' },
    { id: 'core', label: 'Abdômen' },
    { id: 'quadriceps', label: 'Quadríceps' },
    { id: 'panturrilha', label: 'Panturrilhas' },
    { id: 'ombros', label: 'Deltóides' }
  ];

  const backLayers: { id: MuscleGroup; label: string }[] = [
    { id: 'costas', label: 'Dorsais/Trapézio' },
    { id: 'triceps', label: 'Tríceps' },
    { id: 'gluteos', label: 'Glúteos' },
    { id: 'isquios', label: 'Posteriores' },
    { id: 'panturrilha', label: 'Panturrilhas' }
  ];

  const renderBody = (side: 'front' | 'back', layers: typeof frontLayers) => {
    // Nota: Em um cenário real, estas URLs seriam para os assets PNG transparentes de cada músculo.
    // O usuário deve substituir 'muscle_{id}_{side}.png' pelos arquivos reais.
    return (
      <div className="relative w-full aspect-[1/2] max-w-[300px] group">
        {/* Base Cinza */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`/assets/body_${side}_base.png`} 
            alt={`Base ${side}`}
            className="w-full h-full object-contain brightness-50 opacity-30 grayscale"
            onError={(e) => {
              // Fallback visual enquanto as imagens não são carregadas
              (e.target as any).src = 'https://picsum.photos/seed/bodybase/400/800';
            }}
          />
        </div>

        {/* Camadas de Músculos (Overlays) */}
        {layers.map((layer) => {
          const score = intensities[layer.id] || 0;
          const opacity = score / 100;
          
          return (
            <div 
              key={layer.id}
              className="absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: opacity }}
            >
              <img 
                src={`/assets/muscle_${layer.id}_${side}.png`} 
                alt={layer.label}
                className="w-full h-full object-contain mix-blend-screen"
                style={{ 
                  filter: `drop-shadow(0 0 10px rgba(255, 0, 0, ${opacity * 0.8})) brightness(1.2)` 
                }}
                onError={(e) => {
                  // Fallback para desenvolvimento
                  (e.target as any).style.display = 'none';
                }}
              />
            </div>
          );
        })}

        {/* Overlay de Texto para Identificação */}
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 italic">
            Vista {side === 'front' ? 'Frontal' : 'Posterior'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col items-center gap-16 w-full py-12", className)}>
      <div className="flex flex-row items-start justify-center gap-12 md:gap-32 w-full">
        {renderBody('front', frontLayers)}
        {renderBody('back', backLayers)}
      </div>

      {/* Legenda Profissional */}
      <div className="mt-8 flex flex-col items-center gap-4 bg-zinc-950/40 p-6 rounded-3xl border border-white/5">
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase italic">Estático</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((v) => (
              <div 
                key={v} 
                className="w-10 h-1.5 rounded-full"
                style={{ 
                  backgroundColor: `rgba(255, 0, 0, ${v})`,
                  boxShadow: v > 0.5 ? `0 0 10px rgba(255, 0, 0, ${v})` : 'none'
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-primary uppercase italic">Ativo (Glow)</span>
        </div>
        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          Sincronização baseada em logs de performance (Firebase Stack)
        </p>
      </div>
    </div>
  );
}
