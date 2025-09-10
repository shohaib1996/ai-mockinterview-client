import QuizAttemptsDetailspage from "@/components/AdminDashboard/QuizAttempts/QuizAttemptsDetailspage"


const QuizAttemptsDetails = async({params,}: {params: Promise<{id: string}>}) => {
    const {id} = await params
  return (
    <QuizAttemptsDetailspage id={id}/>
  )
}

export default QuizAttemptsDetails
