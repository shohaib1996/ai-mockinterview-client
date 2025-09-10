import ListeningPractice from "@/components/UserDashboard/ListeningPractice/ListeningPractice";

const ListeningAudioPracticePage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;

  if (!id) {
    return <div>Error: Listening audio ID is required.</div>;
  }

  const [sessionId, audioId] = id.split("-");

  return <ListeningPractice sessionId={sessionId} id={audioId} />;
};

export default ListeningAudioPracticePage;
