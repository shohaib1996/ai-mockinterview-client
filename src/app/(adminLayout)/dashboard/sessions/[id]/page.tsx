import { SessionDetailsPage } from "@/components/AdminDashboard/Sessions/SessionDetailsPage";



const SessionDetails = async ({params,}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
  return (
    <SessionDetailsPage id={id} />
  )
}

export default SessionDetails
