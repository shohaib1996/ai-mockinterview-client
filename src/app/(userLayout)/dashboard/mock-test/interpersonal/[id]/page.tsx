

import InterpersonalDetailsPage from '@/components/UserDashboard/MockTest/InterpersonalDetailsPage';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <InterpersonalDetailsPage id={params.id} />
    </div>
  );
};

export default page;
