"use client"

import React from "react"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Target } from "lucide-react"

interface QuizPerformanceData {
  correct: number
  incorrect: number
}

interface QuizPerformanceChartProps {
  data: QuizPerformanceData
}

export function QuizPerformanceChart({ data }: QuizPerformanceChartProps) {
  const chartData = React.useMemo(() => {
    if (!data) return []

    const total = data.correct + data.incorrect
    return [
      {
        name: "Correct",
        value: data.correct,
        percentage: total > 0 ? Math.round((data.correct / total) * 100) : 0,
      },
      {
        name: "Incorrect",
        value: data.incorrect,
        percentage: total > 0 ? Math.round((data.incorrect / total) * 100) : 0,
      },
    ]
  }, [data])

  const chartConfig = {
    correct: {
      label: "Correct",
      color: "hsl(var(--chart-2))",
    },
    incorrect: {
      label: "Incorrect",
      color: "hsl(var(--chart-5))",
    },
  }

  const COLORS = ["hsl(var(--chart-2))", "hsl(var(--chart-5))"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quiz Performance
        </CardTitle>
        <CardDescription>Overall accuracy across all quiz attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border border-border rounded-lg p-2 shadow-md">
                        <p className="text-foreground font-medium">{data.name}</p>
                        <p className="text-muted-foreground">
                          {data.value} answers ({data.percentage}%)
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 text-center">
          <div className="text-2xl font-bold text-foreground">{chartData[0]?.percentage || 0}%</div>
          <div className="text-sm text-muted-foreground">Overall Accuracy</div>
        </div>
      </CardContent>
    </Card>
  )
}
