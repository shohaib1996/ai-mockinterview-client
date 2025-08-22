import ReadingPractice from "@/components/UserDashboard/ReadingPractice/ReadingPractice";

interface PageProps {
  params: { id: string };
}

const ReadingPracticePage = ({ params }: PageProps) => {
  const { id } = params;
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
