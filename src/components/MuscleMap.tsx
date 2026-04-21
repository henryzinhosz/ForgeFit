/**
 * @fileOverview Componente de Mapa Anatômico Muscular.
 */
'use client';

import React from 'react';
import { MuscleGroup } from '@/lib/muscle-mapping';
import { cn } from '@/lib/utils';

interface MuscleMapProps {
  intensities: Record<MuscleGroup, number>; // 0 a 100
  className?: string;
}

export function MuscleMap({ intensities, className }: MuscleMapProps) {
  const getStyle = (group: MuscleGroup) => {
    const intensity = intensities[group] || 0;
    // Escala de cor: do cinza (zinco-800) ao vermelho elétrico da ForgeFIT
    const opacity = 0.1 + (intensity / 100) * 0.9;
    return {
      fill: intensity > 0 ? `hsla(var(--primary), ${opacity})` : 'rgba(39, 39, 42, 0.3)',
      stroke: intensity > 50 ? 'hsla(var(--primary), 0.8)' : 'rgba(255,255,255,0.05)',
      strokeWidth: intensity > 50 ? '2' : '1',
      transition: 'all 1s ease-out'
    };
  };

  return (
    <div className={cn("grid grid-cols-2 gap-8 items-center justify-center p-4", className)}>
      {/* VISTA FRONTAL */}
      <div className="relative group">
        <h5 className="text-[10px] font-black uppercase italic text-center mb-4 text-muted-foreground tracking-widest">Vista Frontal</h5>
        <svg viewBox="0 0 200 400" className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,0,0,0.1)]">
          {/* Cabeça e Pescoço */}
          <circle cx="100" cy="40" r="15" fill="#18181b" />
          <rect x="92" y="55" width="16" height="10" fill="#18181b" />
          
          {/* Ombros */}
          <path d="M70 70 Q100 60 130 70 L135 90 L65 90 Z" style={getStyle('ombros')} />
          
          {/* Peito */}
          <path d="M75 95 Q100 90 125 95 L125 130 Q100 135 75 130 Z" style={getStyle('peito')} />
          
          {/* Abdômen (Core) */}
          <path d="M80 135 L120 135 L115 190 L85 190 Z" style={getStyle('core')} />
          
          {/* Braços Superiores (Bíceps) */}
          <path d="M55 95 L65 95 L68 150 L58 150 Z" style={getStyle('biceps')} />
          <path d="M135 95 L145 95 L142 150 L132 150 Z" style={getStyle('biceps')} />
          
          {/* Antebraços */}
          <path d="M58 155 L68 155 L65 210 L55 210 Z" style={getStyle('antebraco')} />
          <path d="M132 155 L142 155 L145 210 L135 210 Z" style={getStyle('antebraco')} />
          
          {/* Quadríceps */}
          <path d="M85 200 L115 200 L110 290 L80 290 Z" style={getStyle('quadriceps')} />
          <path d="M90 200 L110 200 L115 290 L95 290 Z" style={getStyle('quadriceps')} className="opacity-0" /> {/* Hidden helper */}
          <path d="M78 200 Q85 195 95 200 L90 290 Q85 295 75 290 Z" style={getStyle('quadriceps')} />
          <path d="M105 200 Q115 195 122 200 L125 290 Q115 295 110 290 Z" style={getStyle('quadriceps')} />

          {/* Panturrilhas */}
          <path d="M80 300 L95 300 L92 370 L82 370 Z" style={getStyle('panturrilha')} />
          <path d="M105 300 L120 300 L118 370 L108 370 Z" style={getStyle('panturrilha')} />
        </svg>
      </div>

      {/* VISTA POSTERIOR */}
      <div className="relative group">
        <h5 className="text-[10px] font-black uppercase italic text-center mb-4 text-muted-foreground tracking-widest">Vista Posterior</h5>
        <svg viewBox="0 0 200 400" className="w-full h-auto drop-shadow-[0_0_15px_rgba(255,0,0,0.1)]">
          {/* Cabeça e Pescoço */}
          <circle cx="100" cy="40" r="15" fill="#18181b" />
          
          {/* Costas (Trapézio/Dorsal) */}
          <path d="M70 70 Q100 60 130 70 L135 150 Q100 160 65 150 Z" style={getStyle('costas')} />
          
          {/* Tríceps */}
          <path d="M55 95 L65 95 L62 150 L52 150 Z" style={getStyle('triceps')} />
          <path d="M135 95 L145 95 L148 150 L138 150 Z" style={getStyle('triceps')} />

          {/* Glúteos */}
          <path d="M80 190 Q100 180 120 190 L125 220 Q100 230 75 220 Z" style={getStyle('gluteos')} />
          
          {/* Isquiotibiais */}
          <path d="M80 225 L95 225 L92 300 L77 300 Z" style={getStyle('isquios')} />
          <path d="M105 225 L120 225 L123 300 L108 300 Z" style={getStyle('isquios')} />
          
          {/* Panturrilhas Posterior */}
          <path d="M77 305 L92 305 L89 375 L74 375 Z" style={getStyle('panturrilha')} />
          <path d="M108 305 L123 305 L126 375 L111 375 Z" style={getStyle('panturrilha')} />
        </svg>
      </div>
    </div>
  );
}
