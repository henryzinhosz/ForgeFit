'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized weekly workout plan.
 *
 * - aiGenWorkoutPlan - A function that handles the generation of a workout plan.
 * - AIGenWorkoutPlanInput - The input type for the aiGenWorkoutPlan function.
 * - AIGenWorkoutPlanOutput - The return type for the aiGenWorkoutPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIGenWorkoutPlanInputSchema = z.object({
  fitnessGoals: z.string().describe('The user\'s primary fitness goals (e.g., build strength, lose weight, improve endurance).'),
  workoutDuration: z.string().describe('The preferred duration for each workout session (e.g., "30 minutes", "1 hour", "1.5 hours").'),
  availableEquipment: z.string().describe('A list of all available workout equipment (e.g., "dumbbells, resistance bands", "full gym access", "bodyweight only").'),
});
export type AIGenWorkoutPlanInput = z.infer<typeof AIGenWorkoutPlanInputSchema>;

const ExerciseSchema = z.object({
  exerciseName: z.string().describe('The name of the exercise.'),
  sets: z.string().describe('The number of sets for the exercise (e.g., "3", "4-5").'),
  repsOrTime: z.string().describe('The number of repetitions or duration for the exercise (e.g., "10-12 reps", "30 seconds", "1 km").'),
  instructions: z.string().describe('Brief instructions for performing the exercise.'),
  notes: z.string().optional().describe('Any additional notes or tips for the exercise.'),
});

const DailyWorkoutSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).describe('The day of the week.'),
  workout: z.array(ExerciseSchema).describe('A list of exercises for the day. Can be empty if it\'s a rest day.'),
  dailyNotes: z.string().optional().describe('General notes or advice for this specific day\'s workout.'),
});

const AIGenWorkoutPlanOutputSchema = z.object({
  weeklyPlan: z.array(DailyWorkoutSchema).describe('A detailed weekly workout plan for 7 days.'),
  generalNotes: z.string().optional().describe('Overall general notes or advice for the entire weekly plan.'),
});
export type AIGenWorkoutPlanOutput = z.infer<typeof AIGenWorkoutPlanOutputSchema>;

export async function aiGenWorkoutPlan(input: AIGenWorkoutPlanInput): Promise<AIGenWorkoutPlanOutput> {
  return aiGenWorkoutPlanFlow(input);
}

const aiGenWorkoutPlanPrompt = ai.definePrompt({
  name: 'aiGenWorkoutPlanPrompt',
  input: { schema: AIGenWorkoutPlanInputSchema },
  output: { schema: AIGenWorkoutPlanOutputSchema },
  prompt: `You are an expert fitness coach and personal trainer. Your goal is to create a personalized weekly workout plan.

Based on the user's fitness goals, preferred workout duration, and available equipment, generate a comprehensive 7-day workout plan.
Ensure that the plan is balanced, effective, and adheres strictly to the provided parameters.
If a day is a rest day, the 'workout' array for that day should be empty.
Include clear exercise names, sets, reps/time, and brief instructions for each exercise.

Strictly output the response as a JSON object matching the AIGenWorkoutPlanOutputSchema.
Do not include any other text or explanation outside the JSON object.

User Details:
Fitness Goals: {{{fitnessGoals}}}
Workout Duration per Session: {{{workoutDuration}}}
Available Equipment: {{{availableEquipment}}}`,
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
