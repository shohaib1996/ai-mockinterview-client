import ListeningPractice from "@/components/UserDashboard/ListeningPractice/ListeningPractice";


interface PageProps {
  params: { id: string };
}

const ListeningAudioPracticePage = ({ params }: PageProps) => {
  const { id } = params;
    if (!id) {
        return <div>Error: Listening audio ID is required.</div>;
    }
   const sessionId = id.split("-")[0]; 
   const audioId = id.split("-")[1];

  return <ListeningPractice sessionId={sessionId} id={audioId} />;
};

export default ListeningAudioPracticePage;
