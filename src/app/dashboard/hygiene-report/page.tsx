import { HygieneReport } from '../components/HygieneReport';
import { Header } from '../components/Header';

export default function HygieneReportPage() {
  return (
     <div className="flex flex-col">
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <HygieneReport />
      </div>
    </div>
  );
}
