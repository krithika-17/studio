'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const chartData = [
  { day: 'Mon', served: 420, predicted: 432 },
  { day: 'Tue', served: 410, predicted: 415 },
  { day: 'Wed', served: 425, predicted: 428 },
  { day: 'Thu', served: 430, predicted: 430 },
  { day: 'Fri', served: 405, predicted: 410 },
];

const chartConfig = {
  served: {
    label: 'Served',
    color: 'hsl(var(--primary))',
  },
  predicted: {
    label: 'Predicted',
    color: 'hsl(var(--accent))',
  },
};

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Attendance Trends</CardTitle>
        <CardDescription>Meals served vs. predicted attendance this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="served" fill="var(--color-served)" radius={4} />
            <Bar dataKey="predicted" fill="var(--color-predicted)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
