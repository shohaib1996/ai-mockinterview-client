import WritingPracticePage from "@/components/UserDashboard/WritingPractice/WritingPractice";


const WritingTaskPage = async({ params, }: {params: Promise<{id: string}>}) => {
    const { id } = await params;
    const sessionId= id.split("-")[1];
    const taskId = id.split("-")[0];

  return (
    <WritingPracticePage sessionId={sessionId} taskId={taskId} />
  )
}

export default WritingTaskPage
