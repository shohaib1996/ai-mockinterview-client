import SpeakingTestPage from "@/components/UserDashboard/SpeakingTest/SpeakingTestPage";

const SpeakingTestRoute = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;
  return <SpeakingTestPage sessionId={sessionId} />;
};

export default SpeakingTestRoute;
