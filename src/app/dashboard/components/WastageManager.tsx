'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Recycle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function WastageManager() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ title: 'Success', description: 'Wastage report submitted successfully.'});
    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Wastage Manager</CardTitle>
        </div>
        <CardDescription>Log and categorize food wastage to identify patterns and reduce loss.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="meal-type">Meal Type</Label>
                    <Select name="meal-type" required>
                        <SelectTrigger id="meal-type">
                            <SelectValue placeholder="Select meal..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="wastage-amount">Wastage Amount (kg)</Label>
                    <Input id="wastage-amount" name="wastage-amount" type="number" placeholder="e.g., 2.5" required min="0" step="0.1"/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="wastage-reason">Reason for Wastage</Label>
                <Textarea id="wastage-reason" name="wastage-reason" placeholder="e.g., Over-preparation, student absenteeism..." required />
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Submitting...' : 'Submit Wastage Report'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
