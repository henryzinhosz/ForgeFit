/**
 * @fileOverview Mapeamento de exercícios para grupos musculares.
 */

export type MuscleGroup = 
  | 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps' 
  | 'antebraco' | 'core' | 'quadriceps' | 'isquios' | 'gluteos' | 'panturrilha';

export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  peito: 'chest',
  costas: 'back',
  ombros: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  antebraco: 'forearms',
  core: 'abs',
  quadriceps: 'quads',
  isquios: 'hamstrings',
  gluteos: 'glutes',
  panturrilha: 'calves'
};

export const EXERCISE_MUSCLE_MAP: Record<string, MuscleGroup[]> = {
  '1': ['peito', 'triceps', 'ombros'], // Supino
  '2': ['quadriceps', 'gluteos', 'core'], // Agachamento
  '3': ['costas', 'isquios', 'gluteos', 'core'], // Terra
  '4': ['ombros', 'triceps'], // Militar
  '5': ['costas', 'biceps'], // Remada
  '6': ['biceps'], // Rosca
  '21': ['peito', 'triceps', 'ombros'], // Flexão
  '22': ['peito', 'triceps', 'ombros'], // Flexão Joelho
  '23': ['peito', 'triceps', 'ombros'], // Flexão Aberta
  '24': ['triceps', 'peito'], // Flexão Banco
  '25': ['core'], // Prancha
  '27': ['core'], // Remador
  '28': ['costas', 'biceps'], // Negativas
  '29': ['costas', 'biceps', 'core'], // Isometria Barra
  '30': ['core'], // Supra
  '31': ['antebraco', 'costas'], // Suspensão
  '32': ['core'], // Elevação Pernas
  '41': ['quadriceps', 'panturrilha'], // Corrida
  '42': ['quadriceps', 'gluteos', 'panturrilha'], // Ciclismo
  '43': ['quadriceps', 'panturrilha'], // Corrida Contínua
  '44': ['quadriceps', 'panturrilha'], // Sprint
  '50': ['peito', 'costas', 'core', 'quadriceps'] // Simulado TAF
};
