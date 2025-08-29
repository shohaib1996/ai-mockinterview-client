import TechnicalPracticePage from "@/components/UserDashboard/MockTest/TechnicalPracticePage";


const technicalPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
   <TechnicalPracticePage id={id} />
  );
};
export default technicalPage;
