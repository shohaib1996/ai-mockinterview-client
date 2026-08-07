import ListeningTestPage from "@/components/UserDashboard/ListeningTest/ListeningTestPage";

const ListeningTestRoute = async ({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) => {
  const { sessionId } = await params;
  return <ListeningTestPage sessionId={sessionId} />;
};

export default ListeningTestRoute;
