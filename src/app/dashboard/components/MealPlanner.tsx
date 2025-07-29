'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Loader2, CookingPot, Soup, Salad, Cookie } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { planMeal, PlanMealOutput } from '@/ai/flows/plan-meal';
import { Progress } from '@/components/ui/progress';


function NutrientBar({ label, value, colorClass }: { label: string, value: number, colorClass: string }) {
    return (
        <div>
            <div className="flex justify-between text-xs">
                <span className="font-medium">{label}</span>
                <span>{value}%</span>
            </div>
            <Progress value={value} className="h-2 mt-1" indicatorClassName={colorClass} />
        </div>
    )
}

function MealCard({ title, meal, icon }: { title: string, meal: { name: string; description: string; calories: number; nutrients: { protein: number; carbohydrates: number; fats: number; } }, icon: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    {icon}
                    <CardTitle>{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">{meal.name}</h4>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                    <p className="text-sm font-bold mt-2">{meal.calories} kcal</p>
                </div>
                <div className="space-y-2">
                    <h5 className="font-medium text-sm">Nutrient Breakdown</h5>
                    <NutrientBar label="Protein" value={meal.nutrients.protein} colorClass="bg-green-500" />
                    <NutrientBar label="Carbs" value={meal.nutrients.carbohydrates} colorClass="bg-blue-500" />
                    <NutrientBar label="Fats" value={meal.nutrients.fats} colorClass="bg-yellow-500" />
                </div>
            </CardContent>
        </Card>
    )
}

export function MealPlanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<PlanMealOutput | null>(null);
  const [state, setState] = useState('');
  const [culture, setCulture] = useState('');
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (!state || !culture) {
        toast({ title: 'Missing Information', description: 'Please enter a state and cultural focus.', variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await planMeal({ state: state, culturalFocus: culture });
      setAiResult(result);
      toast({ title: 'Meal Plan Generated', description: 'The AI has successfully created a meal plan.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Meal Plan Failed', description: 'Could not generate the meal plan. Please try again.', variant: 'destructive'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <CookingPot className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">AI Meal Planner</CardTitle>
        </div>
        <CardDescription>Generate balanced, nutritious, and culturally-appropriate meal plans with detailed nutrient breakdowns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" placeholder="e.g., Punjab" required value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="culture">Cultural Focus</Label>
                  <Input id="culture" name="culture" placeholder="e.g., Punjabi" required value={culture} onChange={(e) => setCulture(e.target.value)} />
              </div>
          </div>
          <Button onClick={handleGeneratePlan} disabled={isLoading || !state || !culture} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2" />}
                {isLoading ? 'Generating Plan...' : 'Generate AI Meal Plan'}
          </Button>

          {aiResult && (
            <Alert>
                <Bot className="h-4 w-4" />
                <AlertTitle>AI Generated Meal Plan</AlertTitle>
                <AlertDescription className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                       {aiResult.breakfast && <MealCard title="Breakfast" meal={aiResult.breakfast} icon={<Soup className="text-primary"/>} />}
                       {aiResult.lunch && <MealCard title="Lunch" meal={aiResult.lunch} icon={<Salad className="text-primary"/>} />}
                       {aiResult.snacks && <MealCard title="Snack" meal={aiResult.snacks} icon={<Cookie className="text-primary"/>} />}
                    </div>
                </AlertDescription>
            </Alert>
          )}
      </CardContent>
    </Card>
  );
}
