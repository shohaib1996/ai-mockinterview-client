import SingleQuizPage from "@/components/UserDashboard/Quiz/SingleQuizPage";



const SingleQuiz = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
  
  return (
    <SingleQuizPage id={id} />
  )
}

export default SingleQuiz
