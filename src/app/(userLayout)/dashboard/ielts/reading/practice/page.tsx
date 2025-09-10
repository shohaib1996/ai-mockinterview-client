import { Suspense } from 'react';
import ReadingPracticeClient from './ReadingPracticeClient';

const ReadingPracticePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadingPracticeClient />
    </Suspense>
  );
};

export default ReadingPracticePage;