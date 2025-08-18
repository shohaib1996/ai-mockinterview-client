"use client";

import React from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

interface IeltsScoreTrendData {
  listening: Array<{ date: string; score: number }>;
  reading: Array<{ date: string; score: number }>;
  writing: Array<{ date: string; score: number }>;
  speaking: Array<{ date: string; score: number }>;
}

interface IeltsScoreTrendChartProps {
  data: IeltsScoreTrendData;
}

export function IeltsScoreTrendChart({ data }: IeltsScoreTrendChartProps) {
  // Combine all data points and format for chart
  const chartData = React.useMemo(() => {
    if (!data || Object.values(data).every((scores) => scores.length === 0)) {
      return [];
    }

    const allDates = new Set<string>();
    const dateMap = new Map<string, { date: string; listening?: number; reading?: number; writing?: number; speaking?: number }>();

    // Define valid skill keys
    type SkillKey = keyof IeltsScoreTrendData;

    // Collect all unique dates and scores
    Object.entries(data).forEach(([skill, scores]: [string, Array<{ date: string; score: number }>]) => {
      const skillKey = skill as SkillKey; // Type assertion to valid skill keys
      scores.forEach(({ date, score }) => {
        const formattedDate = new Date(date).toLocaleDateString();
        allDates.add(formattedDate);
        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, { date: formattedDate });
        }
        const entry = dateMap.get(formattedDate)!;
        entry[skillKey] = score; // Now TypeScript knows skillKey is valid
      });
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  const chartConfig = {
    listening: {
      label: "Listening",
      color: "hsl(var(--chart-1))", // Blue
    },
    reading: {
      label: "Reading",
      color: "hsl(var(--chart-2))", // Green
    },
    writing: {
      label: "Writing",
      color: "hsl(var(--chart-3))", // Orange
    },
    speaking: {
      label: "Speaking",
      color: "hsl(var(--chart-4))", // Purple
    },
  };

  const hasData = chartData.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          IELTS Score Trend
        </CardTitle>
        <CardDescription>Track your progress across all IELTS skills over time</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-muted-foreground"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[0, 9]}
                  className="text-muted-foreground"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => value?.toFixed(1)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="listening"
                  stroke="var(--color-listening)"
                  fill="var(--color-listening)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-listening)" }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="reading"
                  stroke="var(--color-reading)"
                  fill="var(--color-reading)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-reading)" }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="writing"
                  stroke="var(--color-writing)"
                  fill="var(--color-writing)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-writing)" }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="speaking"
                  stroke="var(--color-speaking)"
                  fill="var(--color-speaking)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "var(--color-speaking)" }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No score data available</p>
              <p className="text-sm">Start practicing to see your IELTS score trends</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}