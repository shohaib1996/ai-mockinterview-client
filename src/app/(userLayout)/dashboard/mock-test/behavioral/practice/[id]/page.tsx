'use client';

import BehavioralPracticePage from '@/components/UserDashboard/MockTest/BehavioralPracticePage';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <BehavioralPracticePage id={params.id} />
    </div>
  );
};

export default page;
