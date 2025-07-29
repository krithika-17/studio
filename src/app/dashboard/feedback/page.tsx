import { Feedback } from '../components/Feedback';
import { Header } from '../components/Header';

export default function FeedbackPage() {
  return (
     <div className="flex flex-col">
      <Header />
      <div className="p-4 md:p-6 lg:p-8">
        <Feedback />
      </div>
    </div>
  );
}
