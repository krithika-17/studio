'use server';

/**
 * @fileOverview AI agent for suggesting donation options for surplus food.
 *
 * - suggestDonation - Suggests donation options for surplus food.
 * - SuggestDonationInput - Input type for the suggestDonation function.
 * - SuggestDonationOutput - Return type for the suggestDonation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDonationInputSchema = z.object({
  foodItem: z.string().describe('The type of food item available for donation.'),
  quantity: z.number().describe('The quantity of the food item available (in kg).'),
});
export type SuggestDonationInput = z.infer<typeof SuggestDonationInputSchema>;

const SuggestDonationOutputSchema = z.object({
  donationMessage: z
    .string()
    .describe('A message to be sent to NGOs about the donation.'),
  suggestedCharities: z
    .array(
      z.object({
        name: z.string().describe('The name of the charity.'),
        address: z.string().describe('The address of the charity.'),
      })
    )
    .describe('A list of suggested nearby charities or food banks.'),
});
export type SuggestDonationOutput = z.infer<typeof SuggestDonationOutputSchema>;

export async function suggestDonation(
  input: SuggestDonationInput
): Promise<SuggestDonationOutput> {
  return suggestDonationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDonationPrompt',
  input: {schema: SuggestDonationInputSchema},
  output: {schema: SuggestDonationOutputSchema},
  prompt: `You are an AI assistant helping a school's Mid-Day Meal program donate surplus food.

  Based on the food item and quantity, generate a concise and clear message to send to local NGOs. Also, suggest 3 fictional local charities that would accept this kind of food donation.

  Food Item: {{{foodItem}}}
  Quantity: {{{quantity}}} kg

  Generate a donation message and a list of suggested charities.`,
});

const suggestDonationFlow = ai.defineFlow(
  {
    name: 'suggestDonationFlow',
    inputSchema: SuggestDonationInputSchema,
    outputSchema: SuggestDonationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
