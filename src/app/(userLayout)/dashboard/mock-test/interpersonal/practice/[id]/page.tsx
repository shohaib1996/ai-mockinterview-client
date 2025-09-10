'use client';

import InterpersonalPracticePage from '@/components/UserDashboard/MockTest/InterpersonalPracticePage';

const page = async({ params, }: {params: Promise<{id: string}>}) => {
  const {id} = await params
  return (
    <div>
      <InterpersonalPracticePage id={id} />
    </div>
  );
};

export default page;
