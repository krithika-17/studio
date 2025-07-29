import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';

export function MealForecaster() {
  const expectedMeals = 415;
  const purchaseList = [
    { item: 'Rice', quantity: '45 kg' },
    { item: 'Dal (Toor)', quantity: '12 kg' },
    { item: 'Mixed Vegetables', quantity: '20 kg' },
    { item: 'Cooking Oil', quantity: '3 L' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">AI Meal Forecaster</CardTitle>
        </div>
        <CardDescription>Predicted meal needs and purchase plan for tomorrow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Expected Meals Today</h3>
          <p className="text-4xl font-bold text-primary">{expectedMeals}</p>
          <p className="text-sm text-muted-foreground">Based on predicted attendance of 432 students.</p>
        </div>
        <div>
          <h3 className="font-semibold">Smart Purchase Planner</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {purchaseList.map((item) => (
              <li key={item.item}>
                <span className="font-medium">{item.item}:</span> {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
