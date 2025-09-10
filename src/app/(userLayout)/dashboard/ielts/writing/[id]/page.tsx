import WritingDetailsPage from "@/components/UserDashboard/WritingPractice/WritingDetailsPage";


const WritingSessionDetails = async({params,}: {params: Promise<{id: string}>}) => {
  const { id } = await params;  
  return (
    <WritingDetailsPage id={id} />
  )
}

export default WritingSessionDetails
