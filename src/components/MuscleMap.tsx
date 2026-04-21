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
    const opacity = intensity === 0 ? 0.08 : 0.2 + (intensity / 100) * 0.8;
    return {
      fill: intensity > 0 ? `hsla(var(--primary), ${opacity})` : '#1a1a1c',
      stroke: intensity > 0 ? 'hsla(var(--primary), 0.5)' : '#2a2a2c',
      strokeWidth: '0.4',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <div className="grid grid-cols-2 gap-10 md:gap-20 items-start justify-center p-8 bg-zinc-950/50 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* VISTA FRONTAL - ANATOMIA DETALHADA */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase italic text-primary/30 mb-8 tracking-[0.3em] border-b border-primary/10 pb-1">Anatomia Anterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[180px] filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            {/* Cabeça e Pescoço */}
            <path d="M42 15 Q50 2 58 15 L56 30 Q50 32 44 30 Z" fill="#141416" stroke="#2a2a2c" strokeWidth="0.4" />
            
            {/* OMBROS (Deltoide Frontal e Lateral) */}
            <path d="M30 35 Q24 38 27 60 L37 58 Q40 38 30 35" style={getStyle('ombros')} />
            <path d="M70 35 Q76 38 73 60 L63 58 Q60 38 70 35" style={getStyle('ombros')} />
            
            {/* PEITO (Pectoralis Major - Clavicular e Esternal) */}
            <path d="M50 38 L38 35 Q30 45 34 65 L50 70 Z" style={getStyle('peito')} />
            <path d="M50 38 L62 35 Q70 45 66 65 L50 70 Z" style={getStyle('peito')} />
            
            {/* BRAÇOS (Bíceps) */}
            <path d="M25 62 Q20 80 27 98 L34 95 Q32 75 34 60 Z" style={getStyle('biceps')} />
            <path d="M75 62 Q80 80 73 98 L66 95 Q68 75 66 60 Z" style={getStyle('biceps')} />
            
            {/* ANTEBRAÇO */}
            <path d="M26 102 Q18 120 25 145 L35 140 Q38 120 34 102 Z" style={getStyle('antebraco')} />
            <path d="M74 102 Q82 120 75 145 L65 140 Q62 120 66 102 Z" style={getStyle('antebraco')} />
            
            {/* CORE (Rectus Abdominis - Segmentos) */}
            <path d="M43 75 Q50 74 57 75 L57 84 Q50 85 43 84 Z" style={getStyle('core')} /> {/* Upper abs */}
            <path d="M43 86 Q50 85 57 86 L57 95 Q50 96 43 95 Z" style={getStyle('core')} /> {/* Mid abs */}
            <path d="M43 97 Q50 96 57 97 L57 106 Q50 107 43 106 Z" style={getStyle('core')} /> {/* Lower abs */}
            <path d="M45 108 Q50 107 55 108 L55 118 Q50 119 45 118 Z" style={getStyle('core')} /> {/* Bottom abs */}
            
            {/* CORE (Oblíquos e Serrátil) */}
            <path d="M37 72 Q33 85 36 115 L41 115 L41 72 Z" style={getStyle('core')} />
            <path d="M63 72 Q67 85 64 115 L59 115 L59 72 Z" style={getStyle('core')} />
            
            {/* QUADRÍCEPS (Anatomia Realista) */}
            <path d="M30 120 Q22 145 28 175 L44 170 Q48 140 48 120 Z" style={getStyle('quadriceps')} />
            <path d="M70 120 Q78 145 72 175 L56 170 Q52 140 52 120 Z" style={getStyle('quadriceps')} />
            <path d="M45 155 Q48 170 50 175 Q52 170 55 155 Z" style={getStyle('quadriceps')} /> {/* Vasto Medial */}
            
            {/* PANTURRILHA (Frente) */}
            <path d="M30 185 Q28 200 35 215 L45 215 Q48 200 45 185 Z" style={getStyle('panturrilha')} />
            <path d="M70 185 Q72 200 65 215 L55 215 Q52 200 55 185 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR - ANATOMIA DETALHADA */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase italic text-primary/30 mb-8 tracking-[0.3em] border-b border-primary/10 pb-1">Anatomia Posterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[180px] filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            {/* Cabeça e Pescoço */}
            <path d="M42 15 Q50 2 58 15 L56 30 Q50 32 44 30 Z" fill="#141416" stroke="#2a2a2c" strokeWidth="0.4" />

            {/* COSTAS (Trapézio Superior e Médio) */}
            <path d="M50 30 L38 35 Q44 45 50 48 L50 30" style={getStyle('costas')} />
            <path d="M50 30 L62 35 Q56 45 50 48 L50 30" style={getStyle('costas')} />
            
            {/* COSTAS (Latíssimo do Dorso) */}
            <path d="M35 48 Q28 80 38 105 L50 100 L50 55 Z" style={getStyle('costas')} />
            <path d="M65 48 Q72 80 62 105 L50 100 L50 55 Z" style={getStyle('costas')} />
            
            {/* OMBROS POSTERIORES */}
            <path d="M28 35 Q22 38 25 50 L35 50 Q38 38 28 35" style={getStyle('ombros')} />
            <path d="M72 35 Q78 38 75 50 L65 50 Q62 38 72 35" style={getStyle('ombros')} />

            {/* TRÍCEPS (Longo e Lateral) */}
            <path d="M24 55 Q18 78 26 100 L34 95 Q32 75 32 55 Z" style={getStyle('triceps')} />
            <path d="M76 55 Q82 78 74 100 L66 95 Q68 75 68 55 Z" style={getStyle('triceps')} />

            {/* GLÚTEOS */}
            <path d="M30 110 Q26 125 35 145 Q44 152 50 148 L50 110 Z" style={getStyle('gluteos')} />
            <path d="M70 110 Q74 125 65 145 Q56 152 50 148 L50 110 Z" style={getStyle('gluteos')} />

            {/* ISQUIOTIBIAIS (Hamstrings) */}
            <path d="M32 152 Q28 170 34 185 L46 182 Q48 170 46 152 Z" style={getStyle('isquios')} />
            <path d="M68 152 Q72 170 66 185 L54 182 Q52 170 54 152 Z" style={getStyle('isquios')} />

            {/* PANTURRILHA (Gastrocnêmio) */}
            <path d="M32 190 Q28 200 38 215 L46 215 Q48 205 46 190 Z" style={getStyle('panturrilha')} />
            <path d="M68 190 Q72 200 62 215 L54 215 Q52 205 54 190 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA PROFISSIONAL */}
      <div className="flex items-center gap-8 px-10 py-4 bg-zinc-900/50 rounded-full border border-white/5 shadow-inner">
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Inativo</span>
        <div className="flex gap-2">
          {[0.1, 0.3, 0.5, 0.7, 1].map((lvl, i) => (
            <div 
              key={i} 
              className="w-12 h-1.5 rounded-full transition-all duration-1000"
              style={{
                backgroundColor: i === 0 ? 'rgba(255,255,255,0.05)' : `hsla(var(--primary), ${lvl})`,
                boxShadow: i === 4 ? `0 0 15px hsla(var(--primary), 0.6)` : 'none'
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic animate-pulse">Pico</span>
      </div>
    </div>
  );
}
