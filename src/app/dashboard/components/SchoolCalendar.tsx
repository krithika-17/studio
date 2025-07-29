'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

export function SchoolCalendar() {
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [disabledDate, setDisabledDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const today = new Date();
    setDisabledDate(new Date());
    const futureHolidays = [
      new Date(new Date().setDate(today.getDate() + 5)),
      new Date(new Date().setDate(today.getDate() + 10)),
      new Date(new Date().setDate(today.getDate() + 15)),
    ];
    setHolidays(futureHolidays);
  }, []);

  if(!disabledDate) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline">School Calendar</CardTitle>
        </div>
        <CardDescription>Upcoming holidays and events.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={holidays}
          disabled={{ before: disabledDate }}
          className="rounded-md border"
          showOutsideDays={false}
        />
      </CardContent>
    </Card>
  );
}
