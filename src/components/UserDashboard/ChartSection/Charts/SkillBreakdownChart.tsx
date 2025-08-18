"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3 } from "lucide-react"

interface SkillBreakdownData {
  skill: string
  avgScore: number
}

interface SkillBreakdownChartProps {
  data: SkillBreakdownData[]
}

export function SkillBreakdownChart({ data }: SkillBreakdownChartProps) {
  const chartConfig = {
    avgScore: {
      label: "Average Score",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Skill Breakdown
        </CardTitle>
        <CardDescription>Compare your average scores across different skills</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="skill" className="text-muted-foreground" fontSize={12} />
              <YAxis domain={[0, 9]} className="text-muted-foreground" fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="avgScore" fill="var(--color-avgScore)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
