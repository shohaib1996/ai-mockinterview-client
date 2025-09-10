

import InterpersonalDetailsPage from '@/components/UserDashboard/MockTest/InterpersonalDetailsPage';

const page = async({ params, }: {params: Promise<{id: string}>}) => {
  const {id} = await params
  return (
    <div>
      <InterpersonalDetailsPage id={id} />
    </div>
  );
};

export default page;
