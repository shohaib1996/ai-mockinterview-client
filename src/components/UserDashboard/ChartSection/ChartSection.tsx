import { ActivityHeatmapChart } from "./Charts/ActivityHeatmapChart";
import { IeltsScoreTrendChart } from "./Charts/IeltsScoreTrendChart";
import { PerformanceByDifficultyChart } from "./Charts/PerformanceByDifficultyChart";
import { QuizPerformanceChart } from "./Charts/QuizPerformanceChart";
import { SkillBreakdownChart } from "./Charts/SkillBreakdownChart";
import { TimeAllocationChart } from "./Charts/TimeAllocationChart";

interface ChartData {
  ieltsScoreTrend: {
    listening: Array<{ date: string; score: number }>
    reading: Array<{ date: string; score: number }>
    writing: Array<{ date: string; score: number }>
    speaking: Array<{ date: string; score: number }>
  }
  skillBreakdown: Array<{ skill: string; avgScore: number }>
  activityHeatmap: Array<{ date: string; count: number }>
  quizPerformance: { correct: number; incorrect: number }
  performanceByDifficulty: Array<{ difficulty: string; correct: number; total: number; accuracy: number }>
  timeAllocation: Array<{ type: string; minutes: number }>
}

interface ChartsSectionProps {
  chartData: ChartData
}

export function ChartsSection({ chartData }: ChartsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Analytics & Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <IeltsScoreTrendChart data={chartData?.ieltsScoreTrend} />
        <SkillBreakdownChart data={chartData?.skillBreakdown} />
        <ActivityHeatmapChart data={chartData?.activityHeatmap} />
        <QuizPerformanceChart data={chartData?.quizPerformance} />
        <PerformanceByDifficultyChart data={chartData?.performanceByDifficulty} />
        <TimeAllocationChart data={chartData?.timeAllocation} />
      </div>
    </div>
  )
}
