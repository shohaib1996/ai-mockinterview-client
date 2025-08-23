import WritingPracticePage from "@/components/UserDashboard/WritingPractice/WritingPractice";

interface PageProps {
  params: { id: string };
}
const WritingTaskPage = async({ params }: PageProps) => {
    const { id } = params;

  return (
    <WritingPracticePage id={id} />
  )
}

export default WritingTaskPage
