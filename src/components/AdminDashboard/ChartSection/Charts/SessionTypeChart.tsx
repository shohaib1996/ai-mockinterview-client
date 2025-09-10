"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

interface SessionTypeChartProps {
  data: Array<{ label: string; value: number }> | undefined
  isLoading: boolean
}

const COLORS = [
  "hsl(142, 76%, 36%)", // IELTS_LISTENING
  "hsl(221, 83%, 53%)", // IELTS_READING
  "hsl(262, 83%, 58%)", // IELTS_SPEAKING
  "hsl(346, 87%, 43%)", // IELTS_WRITING
  "hsl(35, 91%, 62%)",  // MOCK_INTERVIEW_TECHNICAL
  "hsl(280, 100%, 70%)", // MOCK_INTERVIEW_BEHAVIORAL
  "hsl(195, 100%, 50%)", // MOCK_INTERVIEW_INTERPERSONAL
  "hsl(45, 100%, 51%)",  // QUIZ
]

const SESSION_TYPE_DISPLAY = {
  IELTS_LISTENING: "IELTS Listening",
  IELTS_READING: "IELTS Reading",
  IELTS_SPEAKING: "IELTS Speaking",
  IELTS_WRITING: "IELTS Writing",
  MOCK_INTERVIEW_TECHNICAL: "Mock Technical Interview",
  MOCK_INTERVIEW_BEHAVIORAL: "Mock Behavioral Interview",
  MOCK_INTERVIEW_INTERPERSONAL: "Mock Interpersonal Interview",
  QUIZ: "Quiz",
}

const chartConfig = {
  value: {
    label: "Sessions",
    color: "hsl(var(--chart-1))",
  },
}

const CustomLegend = ({ payload }: any) => {
  const truncateText = (text: string, maxLength = 15) => {
    return text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {payload?.map((entry: any) => (
        <div
          key={`legend-${entry.value}`}
          className="flex items-center gap-1 text-xs cursor-pointer group"
          title={entry.value} // Full name on hover
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="group-hover:text-foreground/80 transition-colors">
            {truncateText(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload?.length) {
    const { name, value } = payload[0]
    return (
      <div className="bg-background border rounded p-2 shadow">
        <p className="font-semibold">{name}</p>
        <p>Sessions: {value}</p>
      </div>
    )
  }
  return null
}

export function SessionTypeChart({ data, isLoading }: SessionTypeChartProps) {
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

  const formatSessionType = (label: string) => {
    const upperLabel = label.toUpperCase()
    return (
      SESSION_TYPE_DISPLAY[upperLabel as keyof typeof SESSION_TYPE_DISPLAY] ||
      label
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    )
  }

  // Ensure all session types are included, even if not in data
  const allSessionTypes = Object.keys(SESSION_TYPE_DISPLAY).map((key) => ({
    label: formatSessionType(key),
    value: data?.find((item) => item.label.toUpperCase() === key)?.value || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Type Distribution</CardTitle>
        <CardDescription>Breakdown of session types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[310px] max-w-[300px] sm:max-w-[600px] md:max-w-[600px] lg:max-w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allSessionTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="label"
              >
                {allSessionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS?.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}