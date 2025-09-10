
import BehavioralDetailsPage from '@/components/UserDashboard/MockTest/BehavioralDetailsPage';

const page = async({ params, }: { params: Promise<{ id: string }> }) => {
  const {id} = await params
  return (
    <div>
      <BehavioralDetailsPage id={id} />
    </div>
  );
};

export default page;
