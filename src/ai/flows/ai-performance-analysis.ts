'use server';
/**
 * @fileOverview An AI agent that analyzes historical workout and performance data to provide personalized insights and recommendations.
 *
 * - aiPerformanceAnalysis - A function that handles the AI performance analysis process.
 * - AIPerformanceAnalysisInput - The input type for the aiPerformanceAnalysis function.
 * - AIPerformanceAnalysisOutput - The return type for the aiPerformanceAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoricalWorkoutEntrySchema = z.object({
  date: z.string().describe('Date of the workout session in ISO format (YYYY-MM-DD).'),
  exercise: z.string().describe('Name of the exercise.'),
  sets: z.number().int().min(0).describe('Number of sets performed.'),
  reps: z.number().int().min(0).optional().describe('Number of repetitions per set, if applicable.'),
  weight: z.number().min(0).optional().describe('Weight lifted in kg, if applicable.'),
  durationMinutes: z.number().min(0).optional().describe('Duration of the exercise in minutes, if applicable.'),
  distanceKm: z.number().min(0).optional().describe('Distance covered in km, if applicable.'),
});

const PerformanceMetricEntrySchema = z.object({
  date: z.string().describe('Date of the metric recording in ISO format (YYYY-MM-DD).'),
  metricType: z.enum(['maxLoad', 'fastestKmTime', 'totalDistance', 'bodyWeight', 'bodyMeasurement']).describe('Type of performance metric.'),
  value: z.number().describe('Value of the metric.'),
  exerciseName: z.string().optional().describe('Name of the exercise for maxLoad metric.'),
  measurementType: z.string().optional().describe('Type of body measurement (e.g., chest, waist) for bodyMeasurement metric.'),
});

const AIPerformanceAnalysisInputSchema = z.object({
  historicalWorkouts: z.array(HistoricalWorkoutEntrySchema).describe('A list of past workout sessions with details.'),
  performanceMetrics: z.array(PerformanceMetricEntrySchema).describe('A list of recorded performance metrics over time.'),
  goals: z.string().optional().describe('User\'s current fitness goals, if provided.'),
});
export type AIPerformanceAnalysisInput = z.infer<typeof AIPerformanceAnalysisInputSchema>;

const AIPerformanceAnalysisOutputSchema = z.object({
  insights: z.array(z.string()).describe('Personalized insights derived from the analysis of the provided data.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations to help break plateaus or optimize training.'),
  plateauDetected: z.boolean().describe('True if a performance plateau is detected, false otherwise.'),
  plateauDetails: z.string().optional().describe('Detailed explanation of the detected plateau, including specific exercises or metrics affected, if any.'),
});
export type AIPerformanceAnalysisOutput = z.infer<typeof AIPerformanceAnalysisOutputSchema>;

export async function aiPerformanceAnalysis(input: AIPerformanceAnalysisInput): Promise<AIPerformanceAnalysisOutput> {
  return aiPerformanceAnalysisFlow(input);
}

const aiPerformanceAnalysisPrompt = ai.definePrompt({
  name: 'aiPerformanceAnalysisPrompt',
  input: {schema: AIPerformanceAnalysisInputSchema},
  output: {schema: AIPerformanceAnalysisOutputSchema},
  prompt: `You are an AI fitness coach specializing in performance analysis. Your task is to analyze a user's historical workout and performance data to provide personalized insights and actionable recommendations. Focus on identifying trends, progress, potential plateaus, and areas for optimization.\n\nHere is the user's historical workout data:\n{{#if historicalWorkouts}}\n{{#each historicalWorkouts}}\n- Date: {{{date}}}, Exercise: {{{exercise}}}, Sets: {{{sets}}}{{#if reps}}, Reps: {{{reps}}}{{/if}}{{#if weight}}, Weight: {{{weight}}}kg{{/if}}{{#if durationMinutes}}, Duration: {{{durationMinutes}}}min{{/if}}{{#if distanceKm}}, Distance: {{{distanceKm}}}km{{/if}}\n{{/each}}\n{{else}}\nNo historical workout data provided.\n{{/if}}\n\nHere are the user's performance metrics:\n{{#if performanceMetrics}}\n{{#each performanceMetrics}}\n- Date: {{{date}}}, Metric Type: {{{metricType}}}, Value: {{{value}}}{{#if exerciseName}}, Exercise: {{{exerciseName}}}{{/if}}{{#if measurementType}}, Measurement: {{{measurementType}}}{{/if}}\n{{/each}}\n{{else}}\nNo performance metrics provided.\n{{/if}}\n\n{{#if goals}}\nThe user's current fitness goals are: {{{goals}}}\n{{else}}\nNo specific fitness goals were provided by the user.\n{{/if}}\n\nBased on the provided data, generate:\n1.  Personalized insights into the user's training, progress, and any noticeable trends.\n2.  Actionable recommendations to help them break plateaus, optimize their training, or improve performance. Consider their goals if provided.\n3.  Determine if a performance plateau is detected. If so, provide details.\n\nFormat your response as a JSON object matching the AIPerformanceAnalysisOutputSchema.`,
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
      throw new Error('Failed to generate performance analysis output.');
    }
    return output;
  }
);
