import ReadingDetailsPage from "@/components/UserDashboard/ReadingPractice/ReadingDetails";


const ReadingDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <ReadingDetailsPage id={id} />;
};

export default ReadingDetails;
