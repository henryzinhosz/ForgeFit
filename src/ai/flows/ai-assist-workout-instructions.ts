'use server';
/**
 * @fileOverview A Genkit flow that acts as an AI Workout Instruction Assistant.
 *
 * - aiAssistWorkoutInstructions - A function that provides detailed, expanded, or alternative execution instructions for an exercise, or suggests variations.
 * - AIAssistWorkoutInstructionsInput - The input type for the aiAssistWorkoutInstructions function.
 * - AIAssistWorkoutInstructionsOutput - The return type for the aiAssistWorkoutInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIAssistWorkoutInstructionsInputSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise (e.g., "Push-up", "Squat").'),
  currentInstructions: z
    .string()
    .optional()
    .describe('Optional: Existing instructions for the exercise that need to be expanded, refined, or altered.'),
  userGoals: z
    .string()
    .optional()
    .describe('Optional: User\u0027s fitness goals (e.g., "build strength", "improve endurance", "reduce joint impact") to suggest variations.'),
});
export type AIAssistWorkoutInstructionsInput = z.infer<typeof AIAssistWorkoutInstructionsInputSchema>;

const AIAssistWorkoutInstructionsOutputSchema = z.object({
  detailedInstructions: z
    .string()
    .describe('The AI-generated detailed, expanded, or alternative execution instructions, and/or suggested variations based on user goals.'),
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
  prompt: `You are an expert fitness coach and exercise specialist. Your goal is to provide clear, safe, and effective workout instructions to help the user ensure correct form and avoid injury.\n\n{{#if currentInstructions}}\nThe user has provided the following instructions for the exercise '{{{exerciseName}}}':\n{{{currentInstructions}}}\nPlease provide a more detailed, expanded, or alternative set of execution instructions for this exercise, focusing on correct form and avoiding injury.\n{{else}}\nProvide detailed execution instructions for the exercise '{{{exerciseName}}}', focusing on correct form and avoiding injury.\n{{/if}}\n\n{{#if userGoals}}\nAdditionally, considering the user's goal to "{{{userGoals}}}", suggest one or more variations of this exercise that align with their objective.\n{{/if}}\n\nEnsure the output is comprehensive and easy to understand, formatted clearly with bullet points or numbered lists where appropriate for instructions and variations.`,
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
