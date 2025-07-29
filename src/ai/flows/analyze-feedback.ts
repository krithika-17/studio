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
});
export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;

export async function analyzeFeedback(input: AnalyzeFeedbackInput): Promise<AnalyzeFeedbackOutput> {
  return analyzeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFeedbackPrompt',
  input: {schema: AnalyzeFeedbackInputSchema},
  output: {schema: AnalyzeFeedbackOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing parent feedback about the Mid-Day Meal program for district officers.

  Analyze the feedback provided and create a concise summary that highlights the key issues, sentiments, and suggestions mentioned.

  Feedback: {{{feedback}}}
  Summary: `,
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
