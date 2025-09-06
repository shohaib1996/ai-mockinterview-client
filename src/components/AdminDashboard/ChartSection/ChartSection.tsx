"use client"

import { AverageScoreChart } from "./Charts/AverageScoreChart";
import { DailyActiveUsersChart } from "./Charts/DailyActiveUsersChart";
import { QuestionDifficultyChart } from "./Charts/QuestionDifficultyChart";
import { SessionTypeChart } from "./Charts/SessionTypeChart";
import { UserEngagementChart } from "./Charts/UserEngagementChart";
import { UserSignupsChart } from "./Charts/UserSignupsChart";



interface ChartData {
  userSignupsLast30Days: Array<{ label: string; value: number }>
  sessionTypeDistribution: Array<{ label: string; value: number }>
  dailyActiveUsersLast30Days: Array<{ label: string; value: number }>
  questionDifficultyDistribution: Array<{ label: string; value: number }>
  userEngagementByHour: Array<{ label: string; value: number }>
  averageScoreBySessionType: Array<{ label: string; value: number }>
  aiVsManualQuestions: Array<{ label: string; value: number }>
  userCompletionHistory: {
    listening: { completed: number; total: number }
    reading: { completed: number; total: number }
  }
}

interface DashboardChartsProps {
  data: ChartData | undefined
  isLoading: boolean
}

export function ChartSection({ data, isLoading }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UserSignupsChart data={data?.userSignupsLast30Days} isLoading={isLoading} />
      <SessionTypeChart data={data?.sessionTypeDistribution} isLoading={isLoading} />
      <DailyActiveUsersChart data={data?.dailyActiveUsersLast30Days} isLoading={isLoading} />
      <QuestionDifficultyChart data={data?.questionDifficultyDistribution} isLoading={isLoading} />
      <UserEngagementChart data={data?.userEngagementByHour} isLoading={isLoading} />
      <AverageScoreChart data={data?.averageScoreBySessionType} isLoading={isLoading} />
    </div>
  )
}
