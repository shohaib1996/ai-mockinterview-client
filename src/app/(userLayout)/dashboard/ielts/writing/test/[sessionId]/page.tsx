import WritingTestPage from "@/components/UserDashboard/WritingTest/WritingTestPage";

const WritingTestRoute = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;
  return <WritingTestPage sessionId={sessionId} />;
};

export default WritingTestRoute;
