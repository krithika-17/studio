'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Receipt, Loader2, Upload, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generatePurchasePlan, GeneratePurchasePlanOutput } from '@/ai/flows/generate-purchase-plan';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ExpenseTracker() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [amount, setAmount] = useState('');
  const [aiResult, setAiResult] = useState<GeneratePurchasePlanOutput | null>(null);
  const { toast } = useToast();
  const expectedMeals = 415;

  useEffect(() => {
    const fetchPurchasePlan = async () => {
        if (!selectedMeal) {
            setAmount('');
            setAiResult(null);
            return;
        };

        setIsCalculating(true);
        setAiResult(null);
        try {
            const result = await generatePurchasePlan({ mealName: selectedMeal, numberOfStudents: expectedMeals });
            setAiResult(result);
            setAmount(result.totalEstimatedCost.toString());
            toast({ title: 'Cost Estimated', description: 'AI has calculated the estimated cost for the meal.' });
        } catch (error) {
            console.error(error);
            toast({ title: 'AI Costing Failed', description: 'Could not estimate the cost. Please enter it manually.', variant: 'destructive' });
        } finally {
            setIsCalculating(false);
        }
    }
    fetchPurchasePlan();
  }, [selectedMeal, toast]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ title: 'Success', description: 'Expense submitted successfully.'});
    setIsSubmitting(false);
    setFileName('');
    setSelectedMeal('');
    setAmount('');
    setAiResult(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Expense Tracker</CardTitle>
        </div>
        <CardDescription>Submit total daily expenses. Select a meal for AI-powered cost estimation.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="expense-category">Meal for Expense</Label>
                    <Select name="expense-category" required onValueChange={setSelectedMeal} value={selectedMeal}>
                        <SelectTrigger id="expense-category">
                            <SelectValue placeholder="Select meal for costing..." />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="Vegetable Biryani">Vegetable Biryani</SelectItem>
                           <SelectItem value="Dal Makhani and Roti">Dal Makhani and Roti</SelectItem>
                           <SelectItem value="Sambar Rice">Sambar Rice</SelectItem>
                           <SelectItem value="Aloo Gobi">Aloo Gobi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount (INR)</Label>
                    <div className="relative">
                        <Input id="expense-amount" name="expense-amount" type="number" placeholder="e.g., 1500" required min="0" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                        {isCalculating && <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                </div>
            </div>
             {aiResult && !isCalculating && (
                <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertTitle>AI-Generated Ingredient Costs</AlertTitle>
                    <AlertDescription>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        {aiResult.purchaseList.map((item) => (
                            <li key={item.item}>
                            <span className="font-medium">{item.item} ({item.quantity}):</span> ₹{item.estimatedCost.toFixed(2)}
                            </li>
                        ))}
                        </ul>
                        <p className="mt-2 text-right font-bold">Total: ₹{aiResult.totalEstimatedCost.toFixed(2)}</p>
                    </AlertDescription>
                </Alert>
            )}
             <div className="space-y-2">
                <Label htmlFor="receipt-upload">Upload Receipt (Optional)</Label>
                <div className="relative">
                    <Button asChild variant="outline" className="w-full justify-start font-normal text-muted-foreground">
                        <div>
                            <Upload className="mr-2" /> {fileName || 'Select a file...'}
                        </div>
                    </Button>
                    <Input id="receipt-upload" type="file" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onChange={handleFileChange}/>
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isCalculating} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Submitting...' : 'Submit Expense'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
