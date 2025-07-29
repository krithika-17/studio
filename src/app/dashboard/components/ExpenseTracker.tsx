'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Receipt, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ExpenseTracker() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

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
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ title: 'Success', description: 'Expense submitted successfully.'});
    setIsLoading(false);
    setFileName('');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Expense Tracker</CardTitle>
        </div>
        <CardDescription>Submit total daily expenses for procurement and other costs.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="expense-category">Expense Category</Label>
                    <Select name="expense-category" required>
                        <SelectTrigger id="expense-category">
                            <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="groceries">Groceries</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="utensils">Utensils</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount (INR)</Label>
                    <Input id="expense-amount" name="expense-amount" type="number" placeholder="e.g., 1500" required min="0" />
                </div>
            </div>
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Submitting...' : 'Submit Expense'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
