import { Suspense } from 'react';
import ListeningPracticeClient from './ListeningPracticeClient';

const ListeningPracticePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListeningPracticeClient />
    </Suspense>
  );
};

export default ListeningPracticePage;