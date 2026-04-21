/**
 * @fileOverview Mapeamento refinado de exercícios para grupos musculares individuais.
 */

export type MuscleGroup = 
  | 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps' 
  | 'antebraco' | 'core' | 'quadriceps' | 'isquios' | 'gluteos' | 'panturrilha';

export const EXERCISE_MUSCLE_MAP: Record<string, MuscleGroup[]> = {
  '1': ['peito', 'triceps', 'ombros'], // Supino Reto
  '2': ['quadriceps', 'gluteos', 'core'], // Agachamento Livre
  '3': ['costas', 'isquios', 'gluteos', 'core'], // Levantamento Terra
  '4': ['ombros', 'triceps', 'core'], // Desenvolvimento Militar
  '5': ['costas', 'biceps', 'antebraco'], // Remada Curvada
  '6': ['biceps', 'antebraco'], // Rosca Direta
  '21': ['peito', 'triceps', 'ombros', 'core'], // Flexão de Braços
  '22': ['peito', 'triceps', 'ombros'], // Flexão de Braços com Joelhos
  '23': ['peito', 'ombros'], // Flexão Aberta
  '24': ['triceps', 'peito'], // Flexão no Banco
  '25': ['core'], // Prancha Isométrica
  '27': ['core'], // Abdominal Remador
  '28': ['costas', 'biceps', 'antebraco'], // Força Superior (Negativas)
  '29': ['costas', 'biceps', 'core', 'antebraco'], // Isometria na Barra Fixa
  '30': ['core'], // Abdominal Supra
  '31': ['antebraco', 'costas'], // Suspensão na Barra Fixa
  '32': ['core'], // Elevação de Pernas
  '41': ['quadriceps', 'panturrilha', 'gluteos'], // Corrida Alternada
  '42': ['quadriceps', 'gluteos', 'panturrilha'], // Ciclismo
  '43': ['quadriceps', 'panturrilha', 'isquios'], // Corrida Contínua
  '44': ['quadriceps', 'panturrilha', 'gluteos'], // Sprint (Tiros)
  '50': ['peito', 'costas', 'core', 'quadriceps', 'ombros', 'antebraco'] // Simulado TAF
};
