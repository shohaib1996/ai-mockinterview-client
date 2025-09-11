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
      color: "hsl(142, 76%, 36%)", // Green-600, vibrant for both modes
    },
    incorrect: {
      label: "Incorrect",
      color: "hsl(0, 84%, 50%)", // Red-500, distinct for contrast
    },
  }

  const COLORS = [chartConfig.correct.color, chartConfig.incorrect.color]

  const hasData = chartData.some((entry) => entry.value > 0)

  return (
    <Card className="w-full">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
          <Target className="h-5 w-5" />
          Quiz Performance
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Overall accuracy across all quiz attempts
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload?.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background dark:bg-background-dark border border-muted dark:border-muted-dark rounded-lg p-2 sm:p-3 shadow-md">
                          <p className="text-foreground dark:text-foreground-dark font-medium">{data?.name}</p>
                          <p className="text-muted-foreground dark:text-muted-foreground-dark">
                            {data.value} answers ({data.percentage}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: 10,
                    fontSize: "0.875rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
            <div className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">No quiz data available</p>
              <p className="text-sm">Take a quiz to see your performance</p>
            </div>
          </div>
        )}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground dark:text-foreground-dark">
            {chartData[0]?.percentage || 0}%
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Overall Accuracy
          </div>
        </div>
      </CardContent>
    </Card>
  )
}