"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
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
  // Define colors for each skill, ensuring visibility in both light and dark modes
  const chartConfig = {
    listening: {
      label: "Listening",
      color: "hsl(221, 83%, 53%)", // Blue-500
    },
    reading: {
      label: "Reading",
      color: "hsl(142, 76%, 36%)", // Green-600
    },
    writing: {
      label: "Writing",
      color: "hsl(24, 94%, 50%)", // Orange-500
    },
    speaking: {
      label: "Speaking",
      color: "hsl(280, 65%, 60%)", // Purple-500
    },
  }

  // Map data to include color based on skill
  const formattedData = data.map(item => ({
    ...item,
    fill: chartConfig[item.skill.toLowerCase() as keyof typeof chartConfig]?.color || "hsl(0, 0%, 50%)" // Fallback color
  }))

  const hasData = data?.length > 0

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
          <BarChart3 className="h-5 w-5" />
          Skill Breakdown
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Compare your average scores across different skills
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={formattedData} 
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted dark:stroke-muted-dark" 
                />
                <XAxis 
                  dataKey="skill" 
                  className="text-muted-foreground dark:text-muted-foreground-dark" 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 9]} 
                  className="text-muted-foreground dark:text-muted-foreground-dark" 
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      className="bg-background dark:bg-background-dark border border-muted dark:border-muted-dark"
                    />
                  } 
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 10,
                    fontSize: '0.875rem',
                  }}
                />
                <Bar 
                  dataKey="avgScore" 
                  radius={[4, 4, 0, 0]} 
                  barSize={Math.max(40, 80 / Math.max(1, data?.length))} // Dynamic bar size based on data length
                >
                  {formattedData.map((entry, index) => (
                    <Bar 
                      key={`bar-${index}`} 
                      dataKey="avgScore" 
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
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">No score data available</p>
              <p className="text-sm">Start practicing to see your skill breakdown</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}