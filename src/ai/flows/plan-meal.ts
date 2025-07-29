'use server';

/**
 * @fileOverview AI agent for planning nutritious and culturally-appropriate meals.
 *
 * - planMeal - Generates a daily meal plan.
 * - PlanMealInput - Input type for the planMeal function.
 * - PlanMealOutput - Return type for the planMeal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlanMealInputSchema = z.object({
  state: z.string().describe('The state in India for which to plan the meal (e.g., "Tamil Nadu", "Punjab").'),
  culturalFocus: z.string().describe('Specific cultural or regional focus for the meal (e.g., "South Indian", "Punjabi").'),
});
export type PlanMealInput = z.infer<typeof PlanMealInputSchema>;

const NutrientSchema = z.object({
    protein: z.number().describe('Percentage of protein.'),
    carbohydrates: z.number().describe('Percentage of carbohydrates.'),
    fats: z.number().describe('Percentage of fats.'),
});

const MealSchema = z.object({
    name: z.string().describe("The name of the dish."),
    description: z.string().describe("A brief description of the dish and its ingredients."),
    calories: z.number().describe("Estimated calorie count."),
    nutrients: NutrientSchema.describe("Nutrient breakdown as percentages (protein, carbohydrates, fats). The sum should be 100."),
});

const PlanMealOutputSchema = z.object({
  breakfast: MealSchema,
  lunch: MealSchema,
  snacks: MealSchema,
});
export type PlanMealOutput = z.infer<typeof PlanMealOutputSchema>;

export async function planMeal(
  input: PlanMealInput
): Promise<PlanMealOutput> {
  return planMealFlow(input);
}

const prompt = ai.definePrompt({
  name: 'planMealPrompt',
  input: {schema: PlanMealInputSchema},
  output: {schema: PlanMealOutputSchema},
  prompt: `You are an expert nutritionist and chef specializing in Indian cuisine for the Mid-Day Meal Scheme. Your task is to create a balanced, nutritious, and culturally appropriate meal plan for a school for one day.

  The meal plan should consist of breakfast, lunch, and an evening snack.

  Consider the following:
  - The plan is for children in the state of {{{state}}}.
  - The meal should reflect {{{culturalFocus}}} culinary traditions.
  - The meal should be cost-effective and use locally available ingredients.
  - The meal should be balanced with essential nutrients (proteins, carbohydrates, fats, vitamins, minerals).

  Generate a meal plan with a name, description, estimated calorie count, and nutrient breakdown (protein, carbohydrates, fats as percentages) for each meal.
  `,
});

const planMealFlow = ai.defineFlow(
  {
    name: 'planMealFlow',
    inputSchema: PlanMealInputSchema,
    outputSchema: PlanMealOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
