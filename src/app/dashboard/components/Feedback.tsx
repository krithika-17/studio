'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Megaphone, Mic, Bot, Loader2, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { analyzeFeedback, AnalyzeFeedbackOutput } from '@/ai/flows/analyze-feedback';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const impactStyles = {
    High: {
      variant: 'destructive',
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
    },
    Medium: {
      variant: 'secondary',
      icon: <Info className="h-5 w-5 text-secondary-foreground" />,
    },
    Low: {
      variant: 'default',
      icon: <CheckCircle className="h-5 w-5 text-primary" />,
    },
};

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
      toast({ title: 'Feedback Analyzed', description: 'AI has summarized and prioritized the feedback.'});
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
        <CardDescription>Submit feedback via text or voice. AI will summarize and prioritize it based on impact.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type or record your feedback here..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={4}
        />
        {result && (
          <div className="space-y-4 rounded-md border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <Bot className="h-6 w-6 flex-shrink-0" /> 
                <div className="flex-grow">
                  <h3 className="font-semibold">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-md bg-background p-3">
                  <div className='flex items-center gap-2'>
                    {impactStyles[result.impactLevel].icon}
                    <span className='font-semibold'>Impact Level</span>
                  </div>
                  <Badge variant={impactStyles[result.impactLevel].variant}>{result.impactLevel}</Badge>
              </div>
               <div className="rounded-md bg-background p-3">
                  <h4 className="font-semibold">Suggested Action</h4>
                  <p className="text-sm text-muted-foreground mt-1">{result.suggestedAction}</p>
              </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" className="flex-1">
          <Mic className="mr-2 h-4 w-4" /> Record Voice
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || !feedbackText} className="flex-1">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit for Analysis
        </Button>
      </CardFooter>
    </Card>
  );
}
