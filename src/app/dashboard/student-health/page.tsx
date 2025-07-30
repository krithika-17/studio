import { StudentHealth } from '../components/StudentHealth';
import { Header } from '../components/Header';

export default function StudentHealthPage() {
  return (
     <div className="flex flex-col">
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <StudentHealth />
      </div>
    </div>
  );
}
