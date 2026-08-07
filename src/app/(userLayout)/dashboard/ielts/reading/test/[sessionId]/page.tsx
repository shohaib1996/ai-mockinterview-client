import ReadingTestPage from "@/components/UserDashboard/ReadingTest/ReadingTestPage";

const ReadingTestRoute = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;
  return <ReadingTestPage sessionId={sessionId} />;
};

export default ReadingTestRoute;
