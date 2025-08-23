import WritingPracticePage from "@/components/UserDashboard/WritingPractice/WritingPractice";

interface PageProps {
  params: { id: string };
}
const WritingTaskPage = async({ params }: PageProps) => {
    const { id } = params;
    const sessionId= id.split("-")[1];
    const taskId = id.split("-")[0];

  return (
    <WritingPracticePage sessionId={sessionId} taskId={taskId} />
  )
}

export default WritingTaskPage
