"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface UserSignupsChartProps {
  data: Array<{ label: string; value: number }> | undefined
  isLoading: boolean
}

const chartConfig = {
  value: {
    label: "Signups",
    color: "hsl(217, 91%, 60%)", // Blue
  },
}

export function UserSignupsChart({ data, isLoading }: UserSignupsChartProps) {
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

  // Process data to aggregate by date
  const processedData =
    data?.reduce(
      (acc, item) => {
        const existing = acc.find((a) => a.label === item.label)
        if (existing) {
          existing.value += item.value
        } else {
          acc.push({ ...item })
        }
        return acc
      },
      [] as Array<{ label: string; value: number }>,
    ) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Signups (Last 30 Days)</CardTitle>
        <CardDescription>New user registrations over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth={3}
                dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(217, 91%, 60%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
