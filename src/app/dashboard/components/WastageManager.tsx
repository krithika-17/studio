'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpingHand, Loader2, Bot, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { suggestDonation, SuggestDonationOutput } from '@/ai/flows/suggest-donation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WastageManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [aiResult, setAiResult] = useState<SuggestDonationOutput | null>(null);
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const { toast } = useToast();

  const handleGenerateSuggestion = async () => {
    if (!foodItem || !quantity) {
        toast({ title: 'Missing Information', description: 'Please enter a food item and quantity.', variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    setAiResult(null);
    try {
      const result = await suggestDonation({ foodItem, quantity: parseFloat(quantity) });
      setAiResult(result);
    } catch (error) {
      console.error(error);
      toast({ title: 'AI Suggestion Failed', description: 'Could not generate donation suggestions.', variant: 'destructive'});
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNotify = async () => {
    setIsDonating(true);
    // Simulate notifying NGOs
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: 'NGOs Notified', description: 'A notification has been sent out for the food donation.'});
    setIsDonating(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <HelpingHand className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Wastage & Donation Manager</CardTitle>
        </div>
        <CardDescription>Log surplus food and coordinate its donation to people in need.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                  <Label htmlFor="food-item">Food Item</Label>
                  <Input id="food-item" name="food-item" placeholder="e.g., Rice and Dal" required value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="wastage-amount">Surplus Amount (kg)</Label>
                  <Input id="wastage-amount" name="wastage-amount" type="number" placeholder="e.g., 5" required min="0" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
          </div>
          <Button onClick={handleGenerateSuggestion} disabled={isLoading || !foodItem || !quantity} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2" />}
                {isLoading ? 'Generating...' : 'Get AI Donation Suggestions'}
          </Button>

          {aiResult && (
            <Alert>
                <Bot className="h-4 w-4" />
                <AlertTitle>AI Donation Plan</AlertTitle>
                <AlertDescription className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Generated Message for NGOs:</h4>
                        <p className="text-sm text-muted-foreground">"{aiResult.donationMessage}"</p>
                    </div>
                    <div>
                        <h4 className="font-semibold">Suggested Charities:</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {aiResult.suggestedCharities.map(charity => (
                                <li key={charity.name}><strong>{charity.name}</strong> - {charity.address}</li>
                            ))}
                        </ul>
                    </div>
                     <Button onClick={handleNotify} disabled={isDonating} className="w-full mt-4">
                        {isDonating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2" />}
                        {isDonating ? 'Notifying...' : 'Notify NGOs for Pickup'}
                    </Button>
                </AlertDescription>
            </Alert>
          )}

      </CardContent>
    </Card>
  );
}
