/**
 * @fileOverview Componente de Mapa de Calor Muscular Profissional.
 * Implementa técnica de SVG Mapping com segmentação anatômica realista.
 */
'use client';

import React from 'react';
import { MuscleGroup } from '@/lib/muscle-mapping';
import { cn } from '@/lib/utils';

interface MuscleMapProps {
  intensities: Record<MuscleGroup, number>; // Score de 0 a 100
  className?: string;
}

export function MuscleMap({ intensities, className }: MuscleMapProps) {
  /**
   * Lógica de interpolação de cores para o Mapa de Calor (Heatmap)
   * Baseada no Roteiro: Preto/Cinza (0.0) -> Vermelho Vibrante/Glow (1.0)
   */
  const getStyle = (group: MuscleGroup) => {
    const score = intensities[group] || 0;
    const frequency = score / 100;

    // Definição das cores baseada na intensidade
    const isZero = score === 0;
    
    // HSL para Vermelho: 0
    const h = 0;
    const s = isZero ? 0 : 100;
    const l = isZero ? 15 : (25 + (frequency * 40));
    const opacity = isZero ? 0.2 : (0.4 + (frequency * 0.6));

    return {
      fill: `hsla(${h}, ${s}%, ${l}%, ${opacity})`,
      stroke: !isZero ? `hsla(${h}, ${s}%, 60%, 0.8)` : '#27272a',
      strokeWidth: !isZero ? '0.8' : '0.5',
      filter: !isZero ? `drop-shadow(0 0 ${4 + (frequency * 8)}px hsla(${h}, ${s}%, 50%, ${0.3 + (frequency * 0.5)}))` : 'none',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-12 w-full", className)}>
      <div className="flex flex-row items-start justify-center gap-8 md:gap-24 p-8 md:p-16 bg-zinc-950/80 rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] w-full max-w-6xl">
        
        {/* VISTA FRONTAL - body_front.svg equivalent */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/70 mb-10 italic">Vista Frontal</span>
          <svg viewBox="0 0 100 240" className="w-full h-auto max-w-[320px] drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            {/* Cabeça e Pescoço (Estático) */}
            <path d="M42 12 Q50 2 58 12 L56 28 Q50 30 44 28 Z" fill="#121214" stroke="#27272a" strokeWidth="0.5" />
            <path d="M46 28 L54 28 L53 35 L47 35 Z" fill="#121214" stroke="#27272a" strokeWidth="0.5" />
            
            {/* Peitorais (muscle_chest) */}
            <path id="muscle_chest_l" d="M49 42 L33 38 Q28 45 30 68 L49 75 Z" style={getStyle('peito')} />
            <path id="muscle_chest_r" d="M51 42 L67 38 Q72 45 70 68 L51 75 Z" style={getStyle('peito')} />
            
            {/* Ombros Frontais (muscle_shoulder_front) */}
            <path id="muscle_shoulder_l" d="M28 38 Q21 40 23 60 L32 58 Q34 38 28 38" style={getStyle('ombros')} />
            <path id="muscle_shoulder_r" d="M72 38 Q79 40 77 60 L68 58 Q66 38 72 38" style={getStyle('ombros')} />
            
            {/* Abdômen / Core (muscle_abs) */}
            <path id="muscle_abs_top" d="M43 78 L57 78 L57 88 L43 88 Z" style={getStyle('core')} />
            <path id="muscle_abs_mid" d="M42 90 L58 90 L58 102 L42 102 Z" style={getStyle('core')} />
            <path id="muscle_abs_low" d="M42 104 L58 104 L56 120 L44 120 Z" style={getStyle('core')} />
            
            {/* Bíceps (muscle_biceps) */}
            <path id="muscle_bicep_l" d="M23 65 Q17 85 24 108 L32 105 Q28 80 32 65 Z" style={getStyle('biceps')} />
            <path id="muscle_bicep_r" d="M77 65 Q83 85 76 108 L68 105 Q72 80 68 65 Z" style={getStyle('biceps')} />
            
            {/* Antebraços (muscle_forearm_front) */}
            <path id="muscle_forearm_l" d="M23 115 Q14 135 21 160 L31 155 Q33 135 31 115 Z" style={getStyle('antebraco')} />
            <path id="muscle_forearm_r" d="M77 115 Q86 135 79 160 L69 155 Q67 135 69 115 Z" style={getStyle('antebraco')} />
            
            {/* Quadríceps (muscle_quads) */}
            <path id="muscle_quad_l" d="M30 125 Q20 160 27 200 L46 195 Q48 160 48 125 Z" style={getStyle('quadriceps')} />
            <path id="muscle_quad_r" d="M70 125 Q80 160 73 200 L54 195 Q52 160 52 125 Z" style={getStyle('quadriceps')} />
            
            {/* Panturrilha Frontal (muscle_calf_front) */}
            <path id="muscle_calf_f_l" d="M28 205 Q26 215 34 235 L44 235 Q46 215 44 205 Z" style={getStyle('panturrilha')} />
            <path id="muscle_calf_f_r" d="M72 205 Q74 215 66 235 L56 235 Q54 215 56 205 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR - body_back.svg equivalent */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/70 mb-10 italic">Vista Posterior</span>
          <svg viewBox="0 0 100 240" className="w-full h-auto max-w-[320px] drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            {/* Cabeça e Pescoço (Estático) */}
            <path d="M42 12 Q50 2 58 12 L56 28 Q50 30 44 28 Z" fill="#121214" stroke="#27272a" strokeWidth="0.5" />
            
            {/* Costas / Dorsais (muscle_lats) */}
            <path id="muscle_lat_l" d="M33 55 Q22 90 40 120 L50 115 L50 55 Z" style={getStyle('costas')} />
            <path id="muscle_lat_r" d="M67 55 Q78 90 60 120 L50 115 L50 55 Z" style={getStyle('costas')} />
            
            {/* Trapézio (muscle_traps) */}
            <path id="muscle_trap" d="M40 38 L50 32 L60 38 L65 55 L35 55 Z" style={getStyle('costas')} />
            
            {/* Tríceps (muscle_triceps) */}
            <path id="muscle_tricep_l" d="M21 65 Q16 85 23 108 L31 105 Q28 80 30 65 Z" style={getStyle('triceps')} />
            <path id="muscle_tricep_r" d="M79 65 Q84 85 77 108 L69 105 Q72 80 70 65 Z" style={getStyle('triceps')} />
            
            {/* Glúteos (muscle_glutes) */}
            <path id="muscle_glute_l" d="M30 120 Q23 150 35 168 Q45 175 50 168 L50 120 Z" style={getStyle('gluteos')} />
            <path id="muscle_glute_r" d="M70 120 Q77 150 65 168 Q55 175 50 168 L50 120 Z" style={getStyle('gluteos')} />
            
            {/* Isquiotibiais (muscle_hamstrings) */}
            <path id="muscle_ham_l" d="M32 175 Q27 200 33 220 L45 218 Q47 200 46 175 Z" style={getStyle('isquios')} />
            <path id="muscle_ham_r" d="M68 175 Q73 200 67 220 L55 218 Q53 200 54 175 Z" style={getStyle('isquios')} />
            
            {/* Panturrilhas Posteriores (muscle_calves) */}
            <path id="muscle_calf_p_l" d="M30 225 Q27 235 36 250 L44 250 Q46 235 44 225 Z" style={getStyle('panturrilha')} />
            <path id="muscle_calf_p_r" d="M70 225 Q73 235 64 250 L56 250 Q54 235 56 225 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA - ADS Best Practices */}
      <div className="flex flex-col items-center gap-4 bg-zinc-950/40 px-12 py-6 rounded-3xl border border-white/5 shadow-inner">
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-black text-white/30 uppercase italic tracking-[0.2em]">Menos Treinado</span>
          <div className="flex gap-2">
            {[0.1, 0.3, 0.5, 0.7, 1.0].map((v) => (
              <div 
                key={v} 
                className="w-12 h-2 rounded-full transition-all duration-700"
                style={{ 
                  backgroundColor: `hsla(0, 100%, ${25 + (v * 45)}%, ${0.2 + (v * 0.8)})`,
                  boxShadow: v > 0.6 ? `0 0 15px hsla(0, 100%, 50%, ${v * 0.6})` : 'none',
                  border: v > 0.8 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-primary uppercase italic tracking-[0.2em]">Vermelho Glow</span>
        </div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Frequência de treino baseada nos logs dos últimos 30 dias</p>
      </div>
    </div>
  );
}
