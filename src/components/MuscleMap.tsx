/**
 * @fileOverview Componente de Mapa Anatômico Muscular de Alta Fidelidade.
 * Design Sharded/Low-Poly baseado na referência visual de alta performance.
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
    // Escala de cor: do cinza escuro ao vermelho elétrico da ForgeFIT
    // Usando opacidades graduais para simular o efeito da foto
    const opacity = intensity === 0 ? 0.2 : 0.4 + (intensity / 100) * 0.6;
    return {
      fill: intensity > 0 ? `hsla(var(--primary), ${opacity})` : '#27272a',
      stroke: intensity > 0 ? 'hsla(var(--primary), 0.8)' : '#18181b',
      strokeWidth: '0.5',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="grid grid-cols-2 gap-4 md:gap-12 items-center justify-center p-2 bg-[#0c0c0c]/80 rounded-[2rem] border border-white/5 shadow-2xl">
        {/* VISTA FRONTAL */}
        <div className="relative flex flex-col items-center">
          <span className="text-[9px] font-black uppercase italic text-muted-foreground mb-4 tracking-tighter opacity-40">Front View</span>
          <svg viewBox="0 0 100 200" className="w-full h-auto max-w-[150px]">
            {/* Cabeça e Pescoço (Não treináveis mas parte da estética) */}
            <path d="M45 10 L55 10 L58 25 L42 25 Z" fill="#18181b" />
            <circle cx="50" cy="8" r="6" fill="#18181b" />

            {/* OMBROS (FACETADOS) */}
            <path d="M30 30 L40 28 L42 45 L32 50 Z" style={getStyle('ombros')} />
            <path d="M70 30 L60 28 L58 45 L68 50 Z" style={getStyle('ombros')} />
            <path d="M28 35 L32 32 L30 55 L25 50 Z" style={getStyle('ombros')} />
            <path d="M72 35 L68 32 L70 55 L75 50 Z" style={getStyle('ombros')} />

            {/* PEITO (DIVIDIDO EM FIBRAS) */}
            <path d="M42 32 L50 35 L50 55 L40 55 Z" style={getStyle('peito')} />
            <path d="M58 32 L50 35 L50 55 L60 55 Z" style={getStyle('peito')} />
            <path d="M35 35 L42 32 L40 55 L32 50 Z" style={getStyle('peito')} />
            <path d="M65 35 L58 32 L60 55 L68 50 Z" style={getStyle('peito')} />

            {/* BICEPS */}
            <path d="M25 55 L30 55 L32 85 L26 85 Z" style={getStyle('biceps')} />
            <path d="M75 55 L70 55 L68 85 L74 85 Z" style={getStyle('biceps')} />
            <path d="M22 60 L26 58 L28 85 L24 85 Z" style={getStyle('biceps')} />
            <path d="M78 60 L74 58 L72 85 L76 85 Z" style={getStyle('biceps')} />

            {/* ANTEBRAÇO */}
            <path d="M24 90 L28 90 L30 120 L22 120 Z" style={getStyle('antebraco')} />
            <path d="M76 90 L72 90 L70 120 L78 120 Z" style={getStyle('antebraco')} />

            {/* CORE / ABS (BLOCOS GEOMÉTRICOS) */}
            <path d="M42 60 L58 60 L58 70 L42 70 Z" style={getStyle('core')} />
            <path d="M43 72 L57 72 L57 82 L43 82 Z" style={getStyle('core')} />
            <path d="M44 84 L56 84 L56 94 L44 94 Z" style={getStyle('core')} />
            <path d="M38 60 L41 60 L42 94 L36 94 Z" style={getStyle('core')} /> {/* Oblíquos */}
            <path d="M62 60 L59 60 L58 94 L64 94 Z" style={getStyle('core')} />

            {/* QUADRICEPS (DETALHADO) */}
            <path d="M38 100 L50 100 L48 145 L35 145 Z" style={getStyle('quadriceps')} />
            <path d="M62 100 L50 100 L52 145 L65 145 Z" style={getStyle('quadriceps')} />
            <path d="M32 105 L37 100 L35 145 L28 145 Z" style={getStyle('quadriceps')} />
            <path d="M68 105 L63 100 L65 145 L72 145 Z" style={getStyle('quadriceps')} />

            {/* PANTURRILHA (FRENTE) */}
            <path d="M35 155 L45 155 L42 190 L38 190 Z" style={getStyle('panturrilha')} />
            <path d="M65 155 L55 155 L58 190 L62 190 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR */}
        <div className="relative flex flex-col items-center">
          <span className="text-[9px] font-black uppercase italic text-muted-foreground mb-4 tracking-tighter opacity-40">Back View</span>
          <svg viewBox="0 0 100 200" className="w-full h-auto max-w-[150px]">
             {/* Cabeça e Pescoço */}
            <path d="M45 10 L55 10 L58 25 L42 25 Z" fill="#18181b" />
            <circle cx="50" cy="8" r="6" fill="#18181b" />

            {/* COSTAS (FACETAS LATERAIS E TRAPÉZIO) */}
            <path d="M40 28 L50 25 L60 28 L50 45 Z" style={getStyle('costas')} /> {/* Trapézio Superior */}
            <path d="M40 45 L50 45 L50 90 L35 85 Z" style={getStyle('costas')} /> {/* Lat Esquerdo */}
            <path d="M60 45 L50 45 L50 90 L65 85 Z" style={getStyle('costas')} /> {/* Lat Direito */}
            <path d="M35 40 L40 45 L35 85 L28 65 Z" style={getStyle('costas')} /> {/* Serrátil/Dorsal Lateral */}
            <path d="M65 40 L60 45 L65 85 L72 65 Z" style={getStyle('costas')} />

            {/* TRICEPS */}
            <path d="M24 45 L28 45 L26 85 L20 80 Z" style={getStyle('triceps')} />
            <path d="M76 45 L72 45 L74 85 L80 80 Z" style={getStyle('triceps')} />

            {/* GLUTEOS (GEOMÉTRICOS) */}
            <path d="M35 95 L50 90 L50 115 L32 120 Z" style={getStyle('gluteos')} />
            <path d="M65 95 L50 90 L50 115 L68 120 Z" style={getStyle('gluteos')} />

            {/* ISQUIOTIBIAIS */}
            <path d="M32 125 L48 120 L45 155 L30 155 Z" style={getStyle('isquios')} />
            <path d="M68 125 L52 120 L55 155 L70 155 Z" style={getStyle('isquios')} />

            {/* PANTURRILHA (POSTERIOR) */}
            <path d="M30 160 L45 160 L42 195 L35 195 Z" style={getStyle('panturrilha')} />
            <path d="M70 160 L55 160 L58 195 L65 195 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA (IGUAL À FOTO) */}
      <div className="flex items-center gap-4 mt-2">
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Baixo</span>
        <div className="flex gap-1">
          <div className="w-8 h-1.5 rounded-full bg-zinc-800" />
          <div className="w-8 h-1.5 rounded-full bg-primary/30" />
          <div className="w-8 h-1.5 rounded-full bg-primary/60" />
          <div className="w-8 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
        </div>
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest italic">Alta</span>
      </div>
    </div>
  );
}
