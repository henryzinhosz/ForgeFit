'use server';
/**
 * @fileOverview IA que analisa performance e fornece insights em português.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoricalWorkoutEntrySchema = z.object({
  date: z.string().describe('Data ISO (YYYY-MM-DD).'),
  exercise: z.string().describe('Nome do exercício.'),
  sets: z.number().int().min(0).describe('Séries.'),
  reps: z.number().int().min(0).optional().describe('Reps.'),
  weight: z.number().min(0).optional().describe('Peso em kg.'),
  durationMinutes: z.number().min(0).optional().describe('Minutos.'),
  distanceKm: z.number().min(0).optional().describe('KM.'),
});

const PerformanceMetricEntrySchema = z.object({
  date: z.string().describe('Data ISO.'),
  metricType: z.enum(['maxLoad', 'fastestKmTime', 'totalDistance', 'bodyWeight', 'bodyMeasurement']).describe('Tipo de métrica.'),
  value: z.number().describe('Valor.'),
  exerciseName: z.string().optional().describe('Exercício para maxLoad.'),
  measurementType: z.string().optional().describe('Tipo de medida corporal.'),
});

const AIPerformanceAnalysisInputSchema = z.object({
  historicalWorkouts: z.array(HistoricalWorkoutEntrySchema).describe('Workouts passados.'),
  performanceMetrics: z.array(PerformanceMetricEntrySchema).describe('Métricas registradas.'),
  goals: z.string().optional().describe('Metas atuais.'),
});
export type AIPerformanceAnalysisInput = z.infer<typeof AIPerformanceAnalysisInputSchema>;

const AIPerformanceAnalysisOutputSchema = z.object({
  insights: z.array(z.string()).describe('Insights personalizados em português.'),
  recommendations: z.array(z.string()).describe('Recomendações em português.'),
  plateauDetected: z.boolean().describe('Platô detectado.'),
  plateauDetails: z.string().optional().describe('Detalhes do platô em português.'),
});
export type AIPerformanceAnalysisOutput = z.infer<typeof AIPerformanceAnalysisOutputSchema>;

export async function aiPerformanceAnalysis(input: AIPerformanceAnalysisInput): Promise<AIPerformanceAnalysisOutput> {
  return aiPerformanceAnalysisFlow(input);
}

const aiPerformanceAnalysisPrompt = ai.definePrompt({
  name: 'aiPerformanceAnalysisPrompt',
  input: {schema: AIPerformanceAnalysisInputSchema},
  output: {schema: AIPerformanceAnalysisOutputSchema},
  prompt: `Você é um analista de performance fitness. Analise os dados e forneça insights e recomendações em PORTUGUÊS.\n\nFoque em tendências, progresso e riscos de estagnação.\n\nMetas do usuário: {{{goals}}}\n\nResponda estritamente em PORTUGUÊS com conselhos práticos.`,
});

const aiPerformanceAnalysisFlow = ai.defineFlow(
  {
    name: 'aiPerformanceAnalysisFlow',
    inputSchema: AIPerformanceAnalysisInputSchema,
    outputSchema: AIPerformanceAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await aiPerformanceAnalysisPrompt(input);
    if (!output) {
      throw new Error('Falha ao gerar análise.');
    }
    return output;
  }
);