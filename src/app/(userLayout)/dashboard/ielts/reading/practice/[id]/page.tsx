import ReadingPractice from "@/components/UserDashboard/ReadingPractice/ReadingPractice";


const ReadingPracticePage = async({ params, }: {params: Promise<{id: string}>}) => {
  const { id } = await params;
  if (!id) {
    return <div>Error: Listening audio ID is required.</div>;
  }
  const sessionId = id.split("-")[0];
  const passageId = id.split("-")[1];
  return (
    <ReadingPractice sessionId={sessionId} passageId={passageId} />
  );
};

export default ReadingPracticePage;
