"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
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
    low: {
      label: "Low Difficulty",
      color: "hsl(142, 76%, 36%)", // Green-600, vibrant for both modes
    },
    medium: {
      label: "Medium Difficulty",
      color: "hsl(24, 94%, 50%)", // Orange-500, distinct and bold
    },
    high: {
      label: "High Difficulty",
      color: "hsl(0, 84%, 50%)", // Red-500, clear contrast
    },
  }

  const getDifficultyColor = (difficulty: string) => {
    return chartConfig[difficulty.toLowerCase() as keyof typeof chartConfig]?.color || "hsl(0, 0%, 50%)" // Fallback color
  }

  const chartData = data?.map((item) => ({
    ...item,
    fill: getDifficultyColor(item.difficulty),
  })) || []

  const hasData = chartData?.length > 0

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
          <Zap className="h-5 w-5" />
          Performance by Difficulty
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          How well you perform on questions of different difficulty levels
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted dark:stroke-muted-dark" 
                />
                <XAxis 
                  dataKey="difficulty" 
                  className="text-muted-foreground dark:text-muted-foreground-dark" 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis 
                  domain={[0, 100]} 
                  className="text-muted-foreground dark:text-muted-foreground-dark" 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload?.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background dark:bg-background-dark border border-muted dark:border-muted-dark rounded-lg p-2 sm:p-3 shadow-md">
                          <p className="text-foreground dark:text-foreground-dark font-medium capitalize">{label} Difficulty</p>
                          <p className="text-muted-foreground dark:text-muted-foreground-dark">Accuracy: {data.accuracy}%</p>
                          <p className="text-muted-foreground dark:text-muted-foreground-dark">
                            {data.correct}/{data.total} correct
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
                    fontSize: '0.875rem',
                  }}
                />
                <Bar 
                  dataKey="accuracy" 
                  radius={[4, 4, 0, 0]} 
                  barSize={Math.max(40, 80 / Math.max(1, chartData?.length))}
                >
                  {chartData.map((entry, index) => (
                    <Bar 
                      key={`bar-${index}`} 
                      dataKey="accuracy" 
                      fill={entry.fill}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
            <div className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">No performance data available</p>
              <p className="text-sm">Answer questions to see your performance by difficulty</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}