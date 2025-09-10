import { Suspense } from 'react';
import WritingPracticeClient from './WritingPracticeClient';

const WritingPracticePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WritingPracticeClient />
    </Suspense>
  );
};

export default WritingPracticePage;