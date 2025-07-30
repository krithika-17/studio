
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, CheckCircle, Megaphone } from 'lucide-react';

const impactStyles = {
    High: {
      variant: 'destructive',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    Medium: {
      variant: 'secondary',
      icon: <Info className="h-4 w-4" />,
    },
    Low: {
      variant: 'default',
      icon: <CheckCircle className="h-4 w-4" />,
    },
};

const feedbackItems = [
  {
    id: 1,
    summary: 'Water quality in the kitchen is poor and smells strange.',
    impactLevel: 'High',
    suggestedAction: 'Immediately inspect the water source and filtration system. Provide bottled water until resolved.',
  },
  {
    id: 2,
    summary: 'The menu has been repetitive for the last two weeks.',
    impactLevel: 'Medium',
    suggestedAction: 'Review the meal schedule and introduce more variety based on the AI meal planner suggestions.',
  },
  {
    id: 3,
    summary: 'The dal served yesterday was delicious. The children loved it!',
    impactLevel: 'Low',
    suggestedAction: 'Share the positive feedback with the kitchen staff and consider adding the meal to the regular rotation.',
  },
  {
    id: 4,
    summary: 'Not enough serving staff during peak lunch hours, leading to long queues.',
    impactLevel: 'High',
    suggestedAction: 'Re-evaluate staffing schedule and allocate more help during the lunch rush.',
  }
];

export function RecentFeedback() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Recent Feedback</CardTitle>
        </div>
        <CardDescription>A prioritized list of the latest feedback submissions, highlighting critical issues.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 rounded-md border bg-muted/20 p-4">
              <div className="flex-shrink-0">
                {impactStyles[item.impactLevel as keyof typeof impactStyles].icon}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.summary}</p>
                  <Badge variant={impactStyles[item.impactLevel as keyof typeof impactStyles].variant}>{item.impactLevel}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Action:</strong> {item.suggestedAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
