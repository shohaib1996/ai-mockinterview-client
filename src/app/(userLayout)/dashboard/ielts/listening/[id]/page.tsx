import ListeningDetailsPage from "@/components/UserDashboard/ListeningPractice/ListeningDetails";

const ListeningDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ListeningDetailsPage id={id} />;
};

export default ListeningDetails;
