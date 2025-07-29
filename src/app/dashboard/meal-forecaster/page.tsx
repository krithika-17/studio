import { MealForecaster } from '../components/MealForecaster';
import { Header } from '../components/Header';

export default function MealForecasterPage() {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <MealForecaster />
      </div>
    </div>
  );
}
