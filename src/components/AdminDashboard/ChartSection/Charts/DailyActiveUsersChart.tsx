"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface DailyActiveUsersChartProps {
  data: Array<{ label: string; value: number }> | undefined
  isLoading: boolean
}

const chartConfig = {
  value: {
    label: "Activity",
    color: "hsl(142, 76%, 36%)", // Green
  },
}

export function DailyActiveUsersChart({ data, isLoading }: DailyActiveUsersChartProps) {
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
        <CardTitle>Daily Activity of Users</CardTitle>
        <CardDescription>User activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
