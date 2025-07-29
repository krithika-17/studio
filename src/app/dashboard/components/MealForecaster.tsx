'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { UtensilsCrossed, Bot, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePurchasePlan, GeneratePurchasePlanOutput } from '@/ai/flows/generate-purchase-plan';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function MealForecaster() {
  const expectedMeals = 415;
  const [selectedMeal, setSelectedMeal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<GeneratePurchasePlanOutput | null>(null);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (!selectedMeal) {
      toast({ title: 'No Meal Selected', description: 'Please select a meal to generate a purchase plan.', variant: 'destructive'});
      return;
    }
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await generatePurchasePlan({ mealName: selectedMeal, numberOfStudents: expectedMeals });
      setAiResult(result);
      toast({ title: 'Purchase Plan Generated', description: 'The AI has successfully created a purchase plan.'});
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Plan Failed', description: 'Could not generate the purchase plan. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">AI Meal Forecaster</CardTitle>
        </div>
        <CardDescription>Predicted meal needs and AI-powered purchase planning.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Expected Meals Today</h3>
          <p className="text-4xl font-bold text-primary">{expectedMeals}</p>
          <p className="text-sm text-muted-foreground">Based on predicted attendance of 432 students.</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Smart Purchase Planner</h3>
          <Select onValueChange={setSelectedMeal} value={selectedMeal}>
            <SelectTrigger>
              <SelectValue placeholder="Select a meal to plan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vegetable Biryani">Vegetable Biryani</SelectItem>
              <SelectItem value="Dal Makhani and Roti">Dal Makhani and Roti</SelectItem>
              <SelectItem value="Sambar Rice">Sambar Rice</SelectItem>
              <SelectItem value="Aloo Gobi">Aloo Gobi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {aiResult && (
          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>AI Generated Purchase Plan</AlertTitle>
            <AlertDescription>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {aiResult.purchaseList.map((item) => (
                    <li key={item.item}>
                      <span className="font-medium">{item.item}:</span> {item.quantity}
                    </li>
                  ))}
                </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
          <Button onClick={handleGeneratePlan} disabled={isLoading || !selectedMeal} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2" />}
            {isLoading ? 'Generating Plan...' : 'Generate Smart Purchase Plan'}
          </Button>
      </CardFooter>
    </Card>
  );
}
