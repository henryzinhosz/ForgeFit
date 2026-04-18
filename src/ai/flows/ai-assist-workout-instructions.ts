'use server';
/**
 * @fileOverview Um fluxo Genkit que atua como Assistente de IA para Instruções de Treino.
 *
 * - aiAssistWorkoutInstructions - Uma função que fornece instruções detalhadas, expandidas ou alternativas para um exercício, ou sugere variações.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAssistWorkoutInstructionsInputSchema = z.object({
  exerciseName: z.string().describe('O nome do exercício (ex: "Flexão", "Agachamento").'),
  currentInstructions: z
    .string()
    .optional()
    .describe('Opcional: Instruções existentes que precisam ser expandidas ou refinadas.'),
  userGoals: z
    .string()
    .optional()
    .describe('Opcional: Metas do usuário (ex: "ganhar força", "melhorar resistência") para sugerir variações.'),
});
export type AIAssistWorkoutInstructionsInput = z.infer<typeof AIAssistWorkoutInstructionsInputSchema>;

const AIAssistWorkoutInstructionsOutputSchema = z.object({
  detailedInstructions: z
    .string()
    .describe('As instruções detalhadas geradas pela IA e/ou variações sugeridas baseadas nas metas.'),
});
export type AIAssistWorkoutInstructionsOutput = z.infer<typeof AIAssistWorkoutInstructionsOutputSchema>;

export async function aiAssistWorkoutInstructions(
  input: AIAssistWorkoutInstructionsInput
): Promise<AIAssistWorkoutInstructionsOutput> {
  return aiAssistWorkoutInstructionsFlow(input);
}

const aiAssistWorkoutInstructionsPrompt = ai.definePrompt({
  name: 'aiAssistWorkoutInstructionsPrompt',
  input: {schema: AIAssistWorkoutInstructionsInputSchema},
  output: {schema: AIAssistWorkoutInstructionsOutputSchema},
  prompt: `Você é um treinador fitness especialista. Seu objetivo é fornecer instruções claras, seguras e eficazes em PORTUGUÊS.\n\n{{#if currentInstructions}}\nO usuário forneceu estas instruções para o exercício '{{{exerciseName}}}':\n{{{currentInstructions}}}\nPor favor, forneça um conjunto detalhado, expandido ou alternativo de instruções focado na forma correta e prevenção de lesões.\n{{else}}\nForneça instruções detalhadas para o exercício '{{{exerciseName}}}', focando na execução perfeita e segurança.\n{{/if}}\n\n{{#if userGoals}}\nAdicionalmente, considerando a meta de "{{{userGoals}}}", sugira variações que alinhem com esse objetivo.\n{{/if}}\n\nGaranta que a resposta esteja em PORTUGUÊS, seja fácil de entender e formatada com bullet points.`,
});

const aiAssistWorkoutInstructionsFlow = ai.defineFlow(
  {
    name: 'aiAssistWorkoutInstructionsFlow',
    inputSchema: AIAssistWorkoutInstructionsInputSchema,
    outputSchema: AIAssistWorkoutInstructionsOutputSchema,
  },
  async input => {
    const {output} = await aiAssistWorkoutInstructionsPrompt(input);
    return output!;
  }
);