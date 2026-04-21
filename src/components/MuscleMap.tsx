/**
 * @fileOverview Componente de Mapa Anatômico Muscular de Alta Fidelidade.
 * Design Realista com silhueta humana e separação detalhada de fibras.
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
    const opacity = intensity === 0 ? 0.15 : 0.3 + (intensity / 100) * 0.7;
    return {
      fill: intensity > 0 ? `hsla(var(--primary), ${opacity})` : '#1c1c1e',
      stroke: intensity > 0 ? 'hsla(var(--primary), 0.6)' : '#2c2c2e',
      strokeWidth: '0.4',
      transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div className="grid grid-cols-2 gap-8 md:gap-16 items-start justify-center p-6 bg-black/40 rounded-[3rem] border border-white/5 backdrop-blur-xl">
        
        {/* VISTA FRONTAL - SILHUETA REALISTA */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase italic text-primary/40 mb-6 tracking-[0.2em]">Anterior View</span>
          <svg viewBox="0 0 100 210" className="w-full h-auto max-w-[160px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {/* Cabeça e Pescoço */}
            <path d="M44 12 Q50 2 56 12 L54 28 L46 28 Z" fill="#1c1c1e" stroke="#2c2c2e" strokeWidth="0.4" />
            
            {/* OMBROS (Deltoide Frontal e Lateral) */}
            <path d="M30 32 Q25 35 28 55 L38 52 Q40 32 30 32" style={getStyle('ombros')} />
            <path d="M70 32 Q75 35 72 55 L62 52 Q60 32 70 32" style={getStyle('ombros')} />
            
            {/* PEITO (Grande Peitoral - Clavicular e Esternal) */}
            <path d="M50 35 L38 32 Q32 40 35 58 L50 62 Z" style={getStyle('peito')} />
            <path d="M50 35 L62 32 Q68 40 65 58 L50 62 Z" style={getStyle('peito')} />
            
            {/* BRAÇOS (Bíceps e Braquial) */}
            <path d="M26 58 Q22 75 28 92 L34 90 Q32 70 34 55 Z" style={getStyle('biceps')} />
            <path d="M74 58 Q78 75 72 92 L66 90 Q68 70 66 55 Z" style={getStyle('biceps')} />
            
            {/* ANTEBRAÇO (Braquiorradial e Flexores) */}
            <path d="M28 95 Q22 110 26 130 L34 125 Q36 105 34 95 Z" style={getStyle('antebraco')} />
            <path d="M72 95 Q78 110 74 130 L66 125 Q64 105 66 95 Z" style={getStyle('antebraco')} />
            
            {/* CORE (Abdominais e Serrátil) */}
            <path d="M42 65 L58 65 L58 75 L42 75 Z" style={getStyle('core')} />
            <path d="M42 78 L58 78 L58 88 L42 88 Z" style={getStyle('core')} />
            <path d="M42 91 L58 91 L58 101 L42 101 Z" style={getStyle('core')} />
            <path d="M36 65 Q32 80 35 105 L40 105 L40 65 Z" style={getStyle('core')} /> {/* Oblíquos */}
            <path d="M64 65 Q68 80 65 105 L60 105 L60 65 Z" style={getStyle('core')} />
            
            {/* QUADRÍCEPS (Vasto Lateral, Medial e Reto Femoral) */}
            <path d="M32 110 Q25 130 30 160 L42 158 Q46 130 46 110 Z" style={getStyle('quadriceps')} />
            <path d="M68 110 Q75 130 70 160 L58 158 Q54 130 54 110 Z" style={getStyle('quadriceps')} />
            <path d="M45 140 Q48 155 50 160 Q52 155 55 140 Z" style={getStyle('quadriceps')} /> {/* Vasto Medial */}
            
            {/* PANTURRILHA (Ventral/Tibial) */}
            <path d="M32 170 Q30 185 36 205 L44 205 Q46 185 44 170 Z" style={getStyle('panturrilha')} />
            <path d="M68 170 Q70 185 64 205 L56 205 Q54 185 56 170 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR - SILHUETA REALISTA */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase italic text-primary/40 mb-6 tracking-[0.2em]">Posterior View</span>
          <svg viewBox="0 0 100 210" className="w-full h-auto max-w-[160px] drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            {/* Cabeça e Pescoço */}
            <path d="M44 12 Q50 2 56 12 L54 28 L46 28 Z" fill="#1c1c1e" stroke="#2c2c2e" strokeWidth="0.4" />

            {/* COSTAS (Trapézio e Latíssimo) */}
            <path d="M50 28 L38 32 Q42 45 50 50 L50 28" style={getStyle('costas')} /> {/* Trapézio Esq */}
            <path d="M50 28 L62 32 Q58 45 50 50 L50 28" style={getStyle('costas')} /> {/* Trapézio Dir */}
            <path d="M35 45 Q30 70 38 100 L50 95 L50 52 Z" style={getStyle('costas')} /> {/* Lats Esq */}
            <path d="M65 45 Q70 70 62 100 L50 95 L50 52 Z" style={getStyle('costas')} /> {/* Lats Dir */}
            
            {/* OMBROS POSTERIORES */}
            <path d="M30 32 Q25 35 28 45 L36 45 Q38 35 30 32" style={getStyle('ombros')} />
            <path d="M70 32 Q75 35 72 45 L64 45 Q62 35 70 32" style={getStyle('ombros')} />

            {/* TRÍCEPS (Cabeça Longa e Lateral) */}
            <path d="M25 50 Q20 70 26 90 L34 85 Q32 65 32 50 Z" style={getStyle('triceps')} />
            <path d="M75 50 Q80 70 74 90 L66 85 Q68 65 68 50 Z" style={getStyle('triceps')} />

            {/* GLÚTEOS (Grande Glúteo) */}
            <path d="M32 105 Q30 115 35 135 Q42 142 50 138 L50 105 Z" style={getStyle('gluteos')} />
            <path d="M68 105 Q70 115 65 135 Q58 142 50 138 L50 105 Z" style={getStyle('gluteos')} />

            {/* ISQUIOTIBIAIS (Bíceps Femoral, Semitendinoso) */}
            <path d="M34 142 Q30 155 35 175 L45 170 Q48 155 46 142 Z" style={getStyle('isquios')} />
            <path d="M66 142 Q70 155 65 175 L55 170 Q52 155 54 142 Z" style={getStyle('isquios')} />

            {/* PANTURRILHA (Gastrocnêmio) */}
            <path d="M34 180 Q30 190 38 208 L46 208 Q48 195 46 180 Z" style={getStyle('panturrilha')} />
            <path d="M66 180 Q70 190 62 208 L54 208 Q52 195 54 180 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA DE ALTA PRECISÃO */}
      <div className="flex items-center gap-6 px-8 py-3 bg-white/5 rounded-full border border-white/5">
        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Rest</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={cn(
                "w-10 h-1 rounded-full transition-all duration-700",
                i === 0 ? "bg-zinc-800" : 
                i === 1 ? "bg-primary/20" :
                i === 2 ? "bg-primary/40" :
                i === 3 ? "bg-primary/70" :
                "bg-primary shadow-[0_0_12px_hsla(var(--primary),0.8)]"
              )} 
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Peak</span>
      </div>
    </div>
  );
}
