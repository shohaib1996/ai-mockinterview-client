import QuizDetailsPage from "@/components/UserDashboard/Quiz/QuizDetailsPage";

const QuizDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <QuizDetailsPage id={id} />
  );
};

export default QuizDetails;
