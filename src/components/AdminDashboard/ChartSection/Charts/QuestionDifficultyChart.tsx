"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"

interface QuestionDifficultyChartProps {
  data: Array<{ label: string; value: number }> | undefined
  isLoading: boolean
}

const DIFFICULTY_COLORS = {
  LOW: "hsl(142, 76%, 36%)", // Green
  MEDIUM: "hsl(221, 83%, 53%)", // Blue
  HIGH: "hsl(346, 87%, 43%)", // Red
}

const DIFFICULTY_DISPLAY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
}

const chartConfig = {
  value: {
    label: "Questions",
    color: "hsl(262, 83%, 58%)", // Fallback purple
  },
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload?.length) {
    const { name, value } = payload[0]
    return (
      <div className="bg-background border rounded p-2 shadow">
        <p className="font-semibold">Difficulty: {name}</p>
        <p>Questions: {value}</p>
      </div>
    )
  }
  return null
}

export function QuestionDifficultyChart({ data, isLoading }: QuestionDifficultyChartProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  const formatDifficulty = (label: string) => {
    const upperLabel = label.toUpperCase()
    return (
      DIFFICULTY_DISPLAY[upperLabel as keyof typeof DIFFICULTY_DISPLAY] ||
      label
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    )
  }

  // Ensure all difficulty levels are included, even if not in data
  const allDifficulties = Object.keys(DIFFICULTY_DISPLAY).map((key) => ({
    label: formatDifficulty(key),
    value: data?.find((item) => item.label.toUpperCase() === key)?.value || 0,
    fill: DIFFICULTY_COLORS[key as keyof typeof DIFFICULTY_COLORS],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Difficulty Distribution</CardTitle>
        <CardDescription>Breakdown by difficulty level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <ResponsiveContainer width="100" height="100%">
            <BarChart data={allDifficulties} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                domain={[0, 'dataMax + 5']}
              />
              <YAxis
                dataKey="label"
                type="category"
                width={80}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {allDifficulties.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}