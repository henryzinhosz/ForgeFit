/**
 * @fileOverview Componente de Mapa de Calor Muscular de alta fidelidade.
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
   * Escala: Preto/Cinza Escuro -> Azul Vibrante/Ciano
   */
  const getStyle = (group: MuscleGroup) => {
    const score = intensities[group] || 0;
    const frequency = score / 100;

    // Interpolação manual de cores: hsl(240, 5%, 10%) para hsl(180, 100%, 50%)
    // Baixo: Cinza quase preto | Alto: Ciano Vibrante
    const h = frequency > 0 ? 180 : 0; // Hue (Ciano)
    const s = frequency > 0 ? 100 : 0; // Saturation
    const l = frequency > 0 ? (10 + (frequency * 40)) : 8; // Lightness
    const opacity = frequency > 0 ? (0.4 + (frequency * 0.6)) : 0.1;

    return {
      fill: `hsla(${h}, ${s}%, ${l}%, ${opacity})`,
      stroke: frequency > 0 ? `hsla(${h}, ${s}%, 70%, 0.8)` : '#27272a',
      strokeWidth: frequency > 0 ? '0.6' : '0.3',
      filter: frequency > 0.7 ? `drop-shadow(0 0 4px hsla(${h}, ${s}%, 50%, 0.5))` : 'none',
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className={cn("flex flex-col items-center gap-10", className)}>
      <div className="flex flex-row items-start justify-center gap-12 p-10 bg-black/40 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* VISTA FRONTAL (Anterior) */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/40 mb-8 italic">Vista Anterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[180px]">
            {/* Cabeça e Pescoço */}
            <path d="M43 15 Q50 5 57 15 L55 30 Q50 32 45 30 Z" fill="#09090b" stroke="#18181b" strokeWidth="0.4" />
            
            {/* Peitorais */}
            <path id="muscle_chest_left" d="M50 42 L35 38 Q30 45 32 65 L50 72 Z" style={getStyle('peito')} />
            <path id="muscle_chest_right" d="M50 42 L65 38 Q70 45 68 65 L50 72 Z" style={getStyle('peito')} />
            
            {/* Ombros (Deltoide Frontal) */}
            <path d="M28 40 Q22 42 25 60 L33 58 Q35 40 28 40" style={getStyle('ombros')} />
            <path d="M72 40 Q78 42 75 60 L67 58 Q65 40 72 40" style={getStyle('ombros')} />
            
            {/* Abdômen (Core) - Segmentado conforme referência */}
            <path d="M42 75 L58 75 L58 85 L42 85 Z" style={getStyle('core')} />
            <path d="M42 88 L58 88 L58 98 L42 98 Z" style={getStyle('core')} />
            <path d="M42 101 L58 101 L58 111 L42 111 Z" style={getStyle('core')} />
            
            {/* Braços (Bíceps) */}
            <path d="M24 65 Q18 85 25 105 L32 102 Q28 80 32 65 Z" style={getStyle('biceps')} />
            <path d="M76 65 Q82 85 75 105 L68 102 Q72 80 68 65 Z" style={getStyle('biceps')} />
            
            {/* Antebraços */}
            <path d="M24 110 Q16 130 22 150 L31 145 Q33 130 31 110 Z" style={getStyle('antebraco')} />
            <path d="M76 110 Q84 130 78 150 L69 145 Q67 130 69 110 Z" style={getStyle('antebraco')} />
            
            {/* Pernas (Quadríceps) */}
            <path d="M30 120 Q22 150 28 185 L46 180 Q48 150 48 120 Z" style={getStyle('quadriceps')} />
            <path d="M70 120 Q78 150 72 185 L54 180 Q52 150 52 120 Z" style={getStyle('quadriceps')} />
            
            {/* Canelas (Tibialis/Panturrilha Lateral) */}
            <path d="M29 195 Q28 205 34 220 L44 220 Q46 205 44 195 Z" style={getStyle('panturrilha')} />
            <path d="M71 195 Q72 205 66 220 L56 220 Q54 205 56 195 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>

        {/* VISTA POSTERIOR */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/40 mb-8 italic">Vista Posterior</span>
          <svg viewBox="0 0 100 220" className="w-full h-auto max-w-[180px]">
            {/* Cabeça */}
            <path d="M43 15 Q50 5 57 15 L55 30 Q50 32 45 30 Z" fill="#09090b" stroke="#18181b" strokeWidth="0.4" />
            
            {/* Costas (Trapézio e Dorsal) */}
            <path d="M50 35 L38 40 Q45 55 50 60 L50 35" style={getStyle('costas')} />
            <path d="M50 35 L62 40 Q55 55 50 60 L50 35" style={getStyle('costas')} />
            <path d="M35 55 Q25 90 40 115 L50 110 L50 55 Z" style={getStyle('costas')} />
            <path d="M65 55 Q75 90 60 115 L50 110 L50 55 Z" style={getStyle('costas')} />
            
            {/* Tríceps */}
            <path d="M22 65 Q18 85 24 105 L31 102 Q28 80 30 65 Z" style={getStyle('triceps')} />
            <path d="M78 65 Q82 85 76 105 L69 102 Q72 80 70 65 Z" style={getStyle('triceps')} />
            
            {/* Glúteos */}
            <path d="M30 115 Q25 140 35 155 Q45 160 50 155 L50 115 Z" style={getStyle('gluteos')} />
            <path d="M70 115 Q75 140 65 155 Q55 160 50 155 L50 115 Z" style={getStyle('gluteos')} />
            
            {/* Isquiotibiais (Hamstrings) */}
            <path d="M32 160 Q28 185 34 200 L46 198 Q48 185 46 160 Z" style={getStyle('isquios')} />
            <path d="M68 160 Q72 185 66 200 L54 198 Q52 185 54 160 Z" style={getStyle('isquios')} />
            
            {/* Panturrilhas */}
            <path d="M31 205 Q28 215 36 230 L44 230 Q46 215 44 205 Z" style={getStyle('panturrilha')} />
            <path d="M69 205 Q72 215 64 230 L56 230 Q54 215 56 205 Z" style={getStyle('panturrilha')} />
          </svg>
        </div>
      </div>

      {/* LEGENDA DE INTENSIDADE (Muscle Legend) */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-6 px-10 py-4 bg-zinc-950/80 rounded-full border border-white/10 shadow-inner">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Recuperação</span>
          <div className="flex gap-2">
            {[0, 25, 50, 75, 100].map((v) => (
              <div 
                key={v} 
                className="w-12 h-1.5 rounded-full transition-all duration-1000"
                style={{
                  backgroundColor: v === 0 ? 'rgba(255,255,255,0.05)' : `hsla(180, 100%, ${10 + (v/100 * 40)}%, ${0.2 + (v/100 * 0.8)})`,
                  boxShadow: v === 100 ? `0 0 15px hsla(180, 100%, 50%, 0.6)` : 'none'
                }}
              />
            ))}
          </div>
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] italic">Atividade Alta</span>
        </div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
          * Baseado na frequência de treino dos últimos 30 dias
        </p>
      </div>
    </div>
  );
}
