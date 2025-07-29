import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, Utensils, Smile, Frown } from 'lucide-react';

export function StatsCards() {
  const stats = [
    { title: 'Expected Students', value: '432', icon: Users, change: '+2.5%' },
    { title: 'Meals to Prepare', value: '415', icon: Utensils, change: '-1.2%' },
    { title: 'Wastage Rate', value: '3.9%', icon: Frown, change: '+0.5%' },
    { title: 'Hygiene Score', value: '98/100', icon: Smile, change: '+2 pts' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change} from yesterday</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
