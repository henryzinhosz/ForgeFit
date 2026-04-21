/**
 * @fileOverview Componente de Mapa Anatômico Muscular Profissional.
 * Silhueta realista, proporções equilibradas e mapeamento detalhado de feixes.
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
    // Opacidade mínima para músculos inativos, brilho progressivo para ativos
    const opacity = intensity === 0 ? 0.1 : 0.3 + (intensity / 100) * 0.7;
    return {
      fill: intensity > 0 ? `hsla(var(--primary), ${opacity})` : '#18181b',
      stroke: intensity > 0 ? 'hsla(var(--primary), 0.6)' : '#27272a',
      strokeWidth: '0.4',
      transition: 'all 0.6s ease-in-out'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      <div className="flex flex-row items-start justify-center gap-12 p-8 bg-zinc-950/40 rounded-[3rem] border border-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* VISTA FRONTAL */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-6 italic">Vista Anterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[160px] drop-shadow-2xl">
            {/* CABEÇA E PESCOÇO (Simétrico) */}
            <path d="M43 15 Q50 5 57 15 L55 30 Q50 32 45 30 Z" fill="#141416" stroke="#27272a" strokeWidth="0.4" />
            
            {/* OMBROS (Deltoide Frontal) */}
            <path d="M30 38 Q25 40 28 58 L36 55 Q38 38 30 38" style={getStyle('ombros')} />
            <path d="M70 38 Q75 40 72 58 L64 55 Q62 38 70 38" style={getStyle('ombros')} />
            
            {/* PEITO (Pectoralis) */}
            <path d="M50 40 L38 38 Q32 45 34 62 L50 68 Z" style={getStyle('peito')} />
            <path d="M50 40 L62 38 Q68 45 66 62 L50 68 Z" style={getStyle('peito')} />
            
            {/* BICEPS */}
            <path d="M26 62 Q21 80 28 95 L34 92 Q32 75 34 60 Z" style={getStyle('biceps')} />
            <path d="M74 62 Q79 80 72 95 L66 92 Q68 75 66 60 Z" style={getStyle('biceps')} />
            
            {/* ANTEBRAÇO */}
            <path d="M27 100 Q20 120 25 140 L34 135 Q36 120 33 100 Z" style={getStyle('antebraco')} />
            <path d="M73 100 Q80 120 75 140 L66 135 Q64 120 67 100 Z" style={getStyle('antebraco')} />
            
            {/* CORE (Abs) */}
            <path d="M44 72 Q50 71 56 72 L56 80 Q50 81 44 80 Z" style={getStyle('core')} />
            <path d="M44 82 Q50 81 56 82 L56 90 Q50 91 44 90 Z" style={getStyle('core')} />
            <path d="M44 92 Q50 91 56 92 L56 100 Q50 101 44 100 Z" style={getStyle('core')} />
            <path d="M37 70 Q33 85 36 110 L42 110 L42 70 Z" style={getStyle('core')} /> {/* Obliquos */}
            <path d="M63 70 Q67 85 64 110 L58 110 L58 70 Z" style={getStyle('core')} />
            
            {/* QUADRICEPS (Proporção Realista) */}
            <path d="M32 115 Q26 140 30 170 L46 165 Q48 140 48 115 Z" style={getStyle('quadriceps')} />
            <path d="M68 115 Q74 140 70 170 L54 165 Q52 140 52 115 Z" style={getStyle('quadriceps')} />
            
            {/* PANTURRILHA */}
            <path d="M31 180 Q30 195 36 210 L44 210 Q46 195 44 180 Z" style={getStyle('panturrilha')} />
            <path d="M69 180 Q70 195 64 210 L56 210 Q54 195 56 180 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-6 italic">Vista Posterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[160px] drop-shadow-2xl">
            {/* CABEÇA */}
            <path d="M43 15 Q50 5 57 15 L55 30 Q50 32 45 30 Z" fill="#141416" stroke="#27272a" strokeWidth="0.4" />

            {/* COSTAS (Trapézio e Dorsal) */}
            <path d="M50 32 L40 36 Q45 45 50 48 L50 32" style={getStyle('costas')} />
            <path d="M50 32 L60 36 Q55 45 50 48 L50 32" style={getStyle('costas')} />
            <path d="M36 48 Q30 80 40 105 L50 100 L50 50 Z" style={getStyle('costas')} />
            <path d="M64 48 Q70 80 60 105 L50 100 L50 50 Z" style={getStyle('costas')} />
            
            {/* OMBROS (Deltoide Posterior) */}
            <path d="M28 38 Q22 40 25 55 L34 52 Q36 40 28 38" style={getStyle('ombros')} />
            <path d="M72 38 Q78 40 75 55 L66 52 Q64 40 72 38" style={getStyle('ombros')} />

            {/* TRICEPS */}
            <path d="M25 58 Q20 80 27 98 L34 95 Q32 75 32 58 Z" style={getStyle('triceps')} />
            <path d="M75 58 Q80 80 73 98 L66 95 Q68 75 68 58 Z" style={getStyle('triceps')} />

            {/* GLUTEOS (Proporção Equilibrada) */}
            <path d="M32 108 Q28 125 36 142 Q45 148 50 145 L50 108 Z" style={getStyle('gluteos')} />
            <path d="M68 108 Q72 125 64 142 Q55 148 50 145 L50 108 Z" style={getStyle('gluteos')} />

            {/* ISQUIOTIBIAIS */}
            <path d="M34 148 Q30 170 36 185 L46 182 Q48 170 46 148 Z" style={getStyle('isquios')} />
            <path d="M66 148 Q70 170 64 185 L54 182 Q52 170 54 148 Z" style={getStyle('isquios')} />

            {/* PANTURRILHA (Gastrocnêmio) */}
            <path d="M32 188 Q29 200 38 215 L46 215 Q48 200 46 188 Z" style={getStyle('panturrilha')} />
            <path d="M68 188 Q71 200 62 215 L54 215 Q52 200 54 188 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA DE INTENSIDADE */}
      <div className="flex items-center gap-6 px-10 py-3 bg-zinc-900/60 rounded-full border border-white/5 shadow-inner">
        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Manutenção</span>
        <div className="flex gap-1.5">
          {[0, 25, 50, 75, 100].map((v) => (
            <div 
              key={v} 
              className="w-10 h-1 rounded-full transition-all duration-700"
              style={{
                backgroundColor: v === 0 ? 'rgba(255,255,255,0.05)' : `hsla(var(--primary), ${0.2 + (v / 100) * 0.8})`,
                boxShadow: v === 100 ? `0 0 10px hsla(var(--primary), 0.5)` : 'none'
              }}
            />
          ))}
        </div>
        <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] italic">Alta Intensidade</span>
      </div>
    </div>
  );
}
