"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, FileText, MessageSquare, Mic, HelpCircle, UserPlus, Clock } from "lucide-react"

interface StatsData {
  totalUsers: number
  weeklyActiveUsers: number
  totalSessions: number
  pendingWritingSubmissions: number
  totalMockInterviews: number
  totalIeltsSessions: number
  totalQuestions: number
  newUsersToday: number
}

interface StatsCardsProps {
  data: StatsData | undefined
  isLoading: boolean
}

const statsConfig = [
  {
    key: "totalUsers" as keyof StatsData,
    title: "Total Users",
    icon: Users,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    key: "weeklyActiveUsers" as keyof StatsData,
    title: "Weekly Active Users",
    icon: Activity,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    key: "totalSessions" as keyof StatsData,
    title: "Total Sessions",
    icon: FileText,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    key: "pendingWritingSubmissions" as keyof StatsData,
    title: "Pending Submissions",
    icon: Clock,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    key: "totalMockInterviews" as keyof StatsData,
    title: "Mock Interviews",
    icon: MessageSquare,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    key: "totalIeltsSessions" as keyof StatsData,
    title: "IELTS Sessions",
    icon: Mic,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    key: "totalQuestions" as keyof StatsData,
    title: "Total Questions",
    icon: HelpCircle,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    key: "newUsersToday" as keyof StatsData,
    title: "New Users Today",
    icon: UserPlus,
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

export function StatsSection({ data, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        const value = data?.[stat.key] ?? 0

        return (
          <Card key={stat.key} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.key === "newUsersToday" ? "Today" : "Total count"}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
