
import BehavioralDetailsPage from '@/components/UserDashboard/MockTest/BehavioralDetailsPage';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <BehavioralDetailsPage id={params.id} />
    </div>
  );
};

export default page;
