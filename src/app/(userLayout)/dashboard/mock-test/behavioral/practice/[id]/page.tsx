'use client';

import BehavioralPracticePage from '@/components/UserDashboard/MockTest/BehavioralPracticePage';

const page = async({ params, }: {params: Promise<{id: string}>}) => {
  const {id} = await params
  return (
    <div>
      <BehavioralPracticePage id={id} />
    </div>
  );
};

export default page;
