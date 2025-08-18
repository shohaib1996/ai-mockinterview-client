"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Zap } from "lucide-react"

interface PerformanceByDifficultyData {
  difficulty: string
  correct: number
  total: number
  accuracy: number
}

interface PerformanceByDifficultyChartProps {
  data: PerformanceByDifficultyData[]
}

export function PerformanceByDifficultyChart({ data }: PerformanceByDifficultyChartProps) {
  const chartConfig = {
    accuracy: {
      label: "Accuracy %",
      color: "hsl(var(--chart-3))",
    },
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "low":
        return "hsl(var(--chart-2))"
      case "medium":
        return "hsl(var(--chart-4))"
      case "high":
        return "hsl(var(--chart-5))"
      default:
        return "hsl(var(--chart-1))"
    }
  }

  const chartData =
    data?.map((item) => ({
      ...item,
      fill: getDifficultyColor(item.difficulty),
    })) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance by Difficulty
        </CardTitle>
        <CardDescription>How well you perform on questions of different difficulty levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="difficulty" className="text-muted-foreground" fontSize={12} />
              <YAxis domain={[0, 100]} className="text-muted-foreground" fontSize={12} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                        <p className="text-foreground font-medium capitalize">{label} Difficulty</p>
                        <p className="text-muted-foreground">Accuracy: {data.accuracy}%</p>
                        <p className="text-muted-foreground">
                          {data.correct}/{data.total} correct
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
