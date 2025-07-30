'use server';
/**
 * @fileOverview Summarizes parent feedback for district officers, providing insights into common issues.
 *
 * - analyzeFeedback - A function that summarizes parent feedback.
 * - AnalyzeFeedbackInput - The input type for the analyzeFeedback function.
 * - AnalyzeFeedbackOutput - The return type for the analyzeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFeedbackInputSchema = z.object({
  feedback:
    z.string().describe('Parent feedback about the Mid-Day Meal program.'),
});
export type AnalyzeFeedbackInput = z.infer<typeof AnalyzeFeedbackInputSchema>;

const AnalyzeFeedbackOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the feedback, highlighting key issues and sentiments.'
    ),
  impactLevel: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The assessed impact level of the feedback.'),
  suggestedAction: z
    .string()
    .describe('A suggested next step to address the feedback.'),
});
export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;

export async function analyzeFeedback(input: AnalyzeFeedbackInput): Promise<AnalyzeFeedbackOutput> {
  return analyzeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFeedbackPrompt',
  input: {schema: AnalyzeFeedbackInputSchema},
  output: {schema: AnalyzeFeedbackOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing parent feedback about the Mid-Day Meal program for district officers.

  Analyze the feedback provided and perform the following tasks:
  1. Create a concise summary that highlights the key issues, sentiments, and suggestions mentioned.
  2. Assess the impact level of the feedback as 'High', 'Medium', or 'Low'. High-impact issues are those that affect health, safety, or widespread dissatisfaction.
  3. Provide a clear, actionable "suggested next step" to address the feedback.

  Feedback: {{{feedback}}}
  `,
});

const analyzeFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeFeedbackFlow',
    inputSchema: AnalyzeFeedbackInputSchema,
    outputSchema: AnalyzeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
