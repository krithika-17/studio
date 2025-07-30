
import { Feedback } from '../components/Feedback';
import { Header } from '../components/Header';
import { RecentFeedback } from '../components/RecentFeedback';

export default function FeedbackPage() {
  return (
     <div className="flex flex-col">
      <Header />
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <Feedback />
        <RecentFeedback />
      </div>
    </div>
  );
}
