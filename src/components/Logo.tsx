import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-lg bg-primary p-1.5">
        <Leaf className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-headline text-lg font-bold">MealWise</span>
    </div>
  );
}
