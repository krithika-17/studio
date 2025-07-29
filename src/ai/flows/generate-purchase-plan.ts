'use server';

/**
 * @fileOverview AI agent for generating a smart purchase plan for a specific meal.
 *
 * - generatePurchasePlan - Generates a purchase plan for a meal.
 * - GeneratePurchasePlanInput - Input type for the generatePurchasePlan function.
 * - GeneratePurchasePlanOutput - Return type for the generatePurchasePlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePurchasePlanInputSchema = z.object({
  mealName: z.string().describe('The name of the meal to plan for (e.g., "Vegetable Biryani").'),
  numberOfStudents: z.number().describe('The number of students to prepare the meal for.'),
});
export type GeneratePurchasePlanInput = z.infer<typeof GeneratePurchasePlanInputSchema>;

const IngredientSchema = z.object({
    item: z.string().describe("The ingredient name."),
    quantity: z.string().describe("The quantity to purchase (e.g., '45 kg', '3 L')."),
});

const GeneratePurchasePlanOutputSchema = z.object({
  purchaseList: z.array(IngredientSchema).describe("A list of ingredients and their quantities to purchase."),
});
export type GeneratePurchasePlanOutput = z.infer<typeof GeneratePurchasePlanOutputSchema>;

export async function generatePurchasePlan(
  input: GeneratePurchasePlanInput
): Promise<GeneratePurchasePlanOutput> {
  return generatePurchasePlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePurchasePlanPrompt',
  input: {schema: GeneratePurchasePlanInputSchema},
  output: {schema: GeneratePurchasePlanOutputSchema},
  prompt: `You are an expert purchase manager for a school's Mid-Day Meal program. Your task is to create a smart purchase plan for a specific meal for a given number of students.

  The plan should list all the necessary ingredients and the quantities required to prepare the meal for {{{numberOfStudents}}} students.

  Meal: {{{mealName}}}
  Number of Students: {{{numberOfStudents}}}
  `,
});

const generatePurchasePlanFlow = ai.defineFlow(
  {
    name: 'generatePurchasePlanFlow',
    inputSchema: GeneratePurchasePlanInputSchema,
    outputSchema: GeneratePurchasePlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
