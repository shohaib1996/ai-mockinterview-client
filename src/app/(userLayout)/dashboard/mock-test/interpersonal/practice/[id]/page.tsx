'use client';

import InterpersonalPracticePage from '@/components/UserDashboard/MockTest/InterpersonalPracticePage';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <InterpersonalPracticePage id={params.id} />
    </div>
  );
};

export default page;
