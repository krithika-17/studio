'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Megaphone, Mic, Bot, Loader2 } from 'lucide-react';
import { analyzeFeedback, AnalyzeFeedbackOutput } from '@/ai/flows/analyze-feedback';
import { useToast } from '@/hooks/use-toast';

export function Feedback() {
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeFeedbackOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
        toast({ title: 'Empty feedback', description: 'Please enter your feedback before submitting.', variant: 'destructive'});
        return;
    }
    
    setIsLoading(true);
    setResult(null);
    try {
      const aiResult = await analyzeFeedback({ feedback: feedbackText });
      setResult(aiResult);
      toast({ title: 'Feedback Analyzed', description: 'AI has summarized the feedback.'});
    } catch (error) {
      console.error(error);
      toast({ title: 'Analysis Failed', description: 'Could not analyze feedback. Please try again.', variant: 'destructive'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Community Feedback</CardTitle>
        </div>
        <CardDescription>Submit feedback via text or voice. AI will summarize it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type or record your feedback here..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={4}
        />
        {result && (
          <div className="space-y-2 rounded-md border bg-muted/50 p-3">
              <div className="flex items-center gap-2 font-semibold">
                <Bot className="h-5 w-5" /> AI Summary
              </div>
              <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Mic className="mr-2 h-4 w-4" /> Record Voice
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || !feedbackText} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
