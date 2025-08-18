"use client"

import { useGetUserDashboardDataQuery } from "@/redux/api/user-dashboard/userDashboardApi"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsSection } from "@/components/UserDashboard/StateSection/StateSection"
import { ChartsSection } from "@/components/UserDashboard/ChartSection/ChartSection"

const UserDashboard = () => {
  const { data, isLoading } = useGetUserDashboardDataQuery({})
  const chartData = data?.data?.charts
  const statsData = data?.data?.stats


  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your IELTS preparation progress</p>
      </div>

      <StatsSection statsData={statsData} />
      <ChartsSection chartData={chartData} />
    </div>
  )
}

export default UserDashboard
