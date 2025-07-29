import { WastageManager } from '../components/WastageManager';
import { Header } from '../components/Header';

export default function WastageManagerPage() {
  return (
     <div className="flex flex-col">
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <WastageManager />
      </div>
    </div>
  );
}
