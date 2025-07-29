'use server';

/**
 * @fileOverview AI agent for analyzing kitchen hygiene from uploaded photos.
 *
 * - checkHygiene - Analyzes kitchen hygiene based on a photo.
 * - CheckHygieneInput - Input type for the checkHygiene function.
 * - CheckHygieneOutput - Return type for the checkHygiene function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckHygieneInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the kitchen, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CheckHygieneInput = z.infer<typeof CheckHygieneInputSchema>;

const CheckHygieneOutputSchema = z.object({
  cleanliness: z.string().describe('The cleanliness assessment of the kitchen.'),
});
export type CheckHygieneOutput = z.infer<typeof CheckHygieneOutputSchema>;

export async function checkHygiene(input: CheckHygieneInput): Promise<CheckHygieneOutput> {
  return checkHygieneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkHygienePrompt',
  input: {schema: CheckHygieneInputSchema},
  output: {schema: CheckHygieneOutputSchema},
  prompt: `You are a hygiene inspector providing feedback on kitchen cleanliness.

  Analyze the provided photo and provide an assessment of the kitchen's cleanliness.

  Respond with one of the following options: "Clean", "Needs Attention".

  Photo: {{media url=photoDataUri}}`,
});

const checkHygieneFlow = ai.defineFlow(
  {
    name: 'checkHygieneFlow',
    inputSchema: CheckHygieneInputSchema,
    outputSchema: CheckHygieneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
