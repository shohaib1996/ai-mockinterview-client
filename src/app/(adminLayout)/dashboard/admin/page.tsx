"use client"

import { ChartSection } from "@/components/AdminDashboard/ChartSection/ChartSection"
import { StatsSection } from "@/components/AdminDashboard/StatsSection/StatsSection"

import { useGetAdminDashboardDataQuery } from "@/redux/api/admin-dashboard/adminDashboardApi"
import { AdminDashboardAnalytics, AdminDashboardStats } from "@/types"

const AdminDashboard = () => {
  const { data, isLoading } = useGetAdminDashboardDataQuery({})
  const statsData = data?.data?.stats || {} as AdminDashboardStats
  const chartData = data?.data?.charts || {} as AdminDashboardAnalytics

  return (
    <div className="min-h-screen  mb-10 p-6">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor your platform&apos;s performance and user engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Key Metrics</h2>
          <StatsSection data={statsData} isLoading={isLoading} />
        </div>

        {/* Charts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Analytics</h2>
          <ChartSection data={chartData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
