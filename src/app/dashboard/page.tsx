import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { AttendanceChart } from './components/AttendanceChart';
import { SchoolCalendar } from './components/SchoolCalendar';
import { Feedback } from './components/Feedback';
import { HygieneReport } from './components/HygieneReport';
import { MealForecaster } from './components/MealForecaster';

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        <StatsCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AttendanceChart />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <HygieneReport />
              <Feedback />
            </div>
          </div>
          <div className="space-y-6 lg:col-span-1">
            <SchoolCalendar />
            <MealForecaster />
          </div>
        </div>
      </main>
    </div>
  );
}
