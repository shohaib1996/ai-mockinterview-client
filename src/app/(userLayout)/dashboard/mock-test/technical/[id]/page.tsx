import TechnicalDetailsPage from "@/components/UserDashboard/MockTest/TechnicalDetailsPage";

const TechnicalDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <TechnicalDetailsPage id={id} />;
};

export default TechnicalDetails;
