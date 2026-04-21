/**
 * @fileOverview Componente de Mapa de Calor Muscular.
 * Implementa mapeamento de caminhos SVG para silhueta humana anatômica.
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
  /**
   * Lógica de interpolação de cores (Color Mapping)
   */
  const getStyle = (group: MuscleGroup) => {
    const score = intensities[group] || 0;
    const frequency = score / 100;

    // Escala: Cinza Escuro -> Vermelho Vivo (ForgeFIT Primary)
    const h = 0; // Vermelho
    const s = frequency > 0 ? 100 : 0;
    const l = frequency > 0 ? (25 + (frequency * 45)) : 15;
    const opacity = frequency > 0 ? (0.4 + (frequency * 0.6)) : 0.15;

    return {
      fill: `hsla(${h}, ${s}%, ${l}%, ${opacity})`,
      stroke: frequency > 0 ? `hsla(${h}, ${s}%, 60%, 0.8)` : '#27272a',
      strokeWidth: frequency > 0 ? '0.8' : '0.5',
      filter: frequency > 0.6 ? `drop-shadow(0 0 6px hsla(${h}, ${s}%, 50%, 0.6))` : 'none',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <div className="flex flex-row items-start justify-center gap-4 sm:gap-20 p-6 sm:p-12 bg-zinc-950/60 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-5xl">
        
        {/* VISTA FRONTAL */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-8 italic">Vista Frontal</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[280px] drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Cabeça */}
            <path d="M43 15 Q50 5 57 15 L55 30 Q50 32 45 30 Z" fill="#0c0c0e" stroke="#27272a" strokeWidth="0.5" />
            
            {/* Peitorais */}
            <path id="chest_l" d="M50 42 L35 38 Q30 45 32 65 L50 72 Z" style={getStyle('peito')} />
            <path id="chest_r" d="M50 42 L65 38 Q70 45 68 65 L50 72 Z" style={getStyle('peito')} />
            
            {/* Ombros */}
            <path d="M28 40 Q22 42 25 60 L33 58 Q35 40 28 40" style={getStyle('ombros')} />
            <path d="M72 40 Q78 42 75 60 L67 58 Q65 40 72 40" style={getStyle('ombros')} />
            
            {/* Core (Abs) */}
            <path d="M42 75 L58 75 L58 115 L42 115 Z" style={getStyle('core')} />
            
            {/* Bíceps */}
            <path d="M24 65 Q18 85 25 105 L32 102 Q28 80 32 65 Z" style={getStyle('biceps')} />
            <path d="M76 65 Q82 85 75 105 L68 102 Q72 80 68 65 Z" style={getStyle('biceps')} />
            
            {/* Antebraços */}
            <path d="M24 110 Q16 130 22 150 L31 145 Q33 130 31 110 Z" style={getStyle('antebraco')} />
            <path d="M76 110 Q84 130 78 150 L69 145 Q67 130 69 110 Z" style={getStyle('antebraco')} />
            
            {/* Quadríceps */}
            <path d="M30 120 Q22 150 28 185 L46 180 Q48 150 48 120 Z" style={getStyle('quadriceps')} />
            <path d="M70 120 Q78 150 72 185 L54 180 Q52 150 52 120 Z" style={getStyle('quadriceps')} />
            
            {/* Panturrilha (Frente) */}
            <path d="M29 195 Q28 205 34 220 L44 220 Q46 205 44 195 Z" style={getStyle('panturrilha')} />
            <path d="M71 195 Q72 205 66 220 L56 220 Q54 205 56 195 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-8 italic">Vista Posterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[280px] drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Cabeça */}
            <path d="M43 15 Q50 5 57 15 L55 30 Q50 32 45 30 Z" fill="#0c0c0e" stroke="#27272a" strokeWidth="0.5" />
            
            {/* Costas */}
            <path d="M35 55 Q25 90 40 115 L50 110 L50 55 Z" style={getStyle('costas')} />
            <path d="M65 55 Q75 90 60 115 L50 110 L50 55 Z" style={getStyle('costas')} />
            
            {/* Tríceps */}
            <path d="M22 65 Q18 85 24 105 L31 102 Q28 80 30 65 Z" style={getStyle('triceps')} />
            <path d="M78 65 Q82 85 76 105 L69 102 Q72 80 70 65 Z" style={getStyle('triceps')} />
            
            {/* Glúteos */}
            <path d="M30 115 Q25 140 35 155 Q45 160 50 155 L50 115 Z" style={getStyle('gluteos')} />
            <path d="M70 115 Q75 140 65 155 Q55 160 50 155 L50 115 Z" style={getStyle('gluteos')} />
            
            {/* Isquiotibiais */}
            <path d="M32 160 Q28 185 34 200 L46 198 Q48 185 46 160 Z" style={getStyle('isquios')} />
            <path d="M68 160 Q72 185 66 200 L54 198 Q52 185 54 160 Z" style={getStyle('isquios')} />
            
            {/* Panturrilhas */}
            <path d="M31 205 Q28 215 36 230 L44 230 Q46 215 44 205 Z" style={getStyle('panturrilha')} />
            <path d="M69 205 Q72 215 64 230 L56 230 Q54 215 56 205 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA */}
      <div className="flex items-center gap-6 bg-zinc-950 px-8 py-4 rounded-full border border-white/10 shadow-xl">
        <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">Baixa Atividade</span>
        <div className="flex gap-1.5">
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
            <div 
              key={v} 
              className="w-10 h-1.5 rounded-full"
              style={{ 
                backgroundColor: `hsla(0, 100%, ${25 + (v * 45)}%, ${0.3 + (v * 0.7)})`,
                boxShadow: v > 0.6 ? `0 0 10px hsla(0, 100%, 50%, ${v * 0.5})` : 'none'
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-primary uppercase italic tracking-widest">Foco Máximo</span>
      </div>
    </div>
  );
}
