'use server';
/**
 * @fileOverview Fluxo para gerar plano de treino semanal em português.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIGenWorkoutPlanInputSchema = z.object({
  fitnessGoals: z.string().describe('Metas fitness do usuário.'),
  workoutDuration: z.string().describe('Duração preferida por sessão.'),
  availableEquipment: z.string().describe('Equipamentos disponíveis.'),
});
export type AIGenWorkoutPlanInput = z.infer<typeof AIGenWorkoutPlanInputSchema>;

const ExerciseSchema = z.object({
  exerciseName: z.string().describe('Nome do exercício.'),
  sets: z.string().describe('Séries.'),
  repsOrTime: z.string().describe('Repetições ou tempo.'),
  instructions: z.string().describe('Instruções breves.'),
  notes: z.string().optional().describe('Notas adicionais.'),
});

const DailyWorkoutSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).describe('Dia da semana.'),
  workout: z.array(ExerciseSchema).describe('Lista de exercícios.'),
  dailyNotes: z.string().optional().describe('Dicas para o dia.'),
});

const AIGenWorkoutPlanOutputSchema = z.object({
  weeklyPlan: z.array(DailyWorkoutSchema).describe('Plano semanal de 7 dias.'),
  generalNotes: z.string().optional().describe('Conselhos gerais em português.'),
});
export type AIGenWorkoutPlanOutput = z.infer<typeof AIGenWorkoutPlanOutputSchema>;

export async function aiGenWorkoutPlan(input: AIGenWorkoutPlanInput): Promise<AIGenWorkoutPlanOutput> {
  return aiGenWorkoutPlanFlow(input);
}

const aiGenWorkoutPlanPrompt = ai.definePrompt({
  name: 'aiGenWorkoutPlanPrompt',
  input: { schema: AIGenWorkoutPlanInputSchema },
  output: { schema: AIGenWorkoutPlanOutputSchema },
  prompt: `Você é um personal trainer especialista. Crie um plano de treino semanal personalizado em PORTUGUÊS.

Baseado nas metas, duração e equipamentos, gere um plano de 7 dias equilibrado.
Se um dia for descanso, deixe a lista de exercícios vazia.
TUDO DEVE SER ESCRITO EM PORTUGUÊS (Brasil).

Metas: {{{fitnessGoals}}}
Duração: {{{workoutDuration}}}
Equipamentos: {{{availableEquipment}}}`,
});

const aiGenWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'aiGenWorkoutPlanFlow',
    inputSchema: AIGenWorkoutPlanInputSchema,
    outputSchema: AIGenWorkoutPlanOutputSchema,
  },
  async (input) => {
    const { output } = await aiGenWorkoutPlanPrompt(input);
    return output!;
  }
);