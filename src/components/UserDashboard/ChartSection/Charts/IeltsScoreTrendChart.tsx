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
    if (!data || Object.values(data).every((scores) => scores?.length === 0)) {
      return [];
    }

    const allDates = new Set<string>();
    const dateMap = new Map<string, { date: string; listening?: number; reading?: number; writing?: number; speaking?: number }>();

    type SkillKey = keyof IeltsScoreTrendData;

    Object.entries(data).forEach(([skill, scores]: [string, Array<{ date: string; score: number }>]) => {
      const skillKey = skill as SkillKey;
      scores.forEach(({ date, score }) => {
        const formattedDate = new Date(date).toLocaleDateString();
        allDates.add(formattedDate);
        if (!dateMap.has(formattedDate)) {
          dateMap.set(formattedDate, { date: formattedDate });
        }
        const entry = dateMap.get(formattedDate)!;
        entry[skillKey] = score;
      });
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  // Define color scheme for light and dark modes
  const chartConfig = {
    listening: {
      label: "Listening",
      color: "hsl(221, 83%, 53%)", // Blue-500 for light, visible in dark
    },
    reading: {
      label: "Reading",
      color: "hsl(142, 76%, 36%)", // Green-600 for light, visible in dark
    },
    writing: {
      label: "Writing",
      color: "hsl(24, 94%, 50%)", // Orange-500 for light, visible in dark
    },
    speaking: {
      label: "Speaking",
      color: "hsl(280, 65%, 60%)", // Purple-500 for light, visible in dark
    },
  };

  const hasData = chartData?.length > 0;

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
          <TrendingUp className="h-5 w-5" />
          IELTS Score Trend
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Track your progress across all IELTS skills over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData} 
                margin={{ 
                  top: 10, 
                  right: 10, 
                  left: 0, 
                  bottom: 10 
                }}
              >
                <CartesianGrid 
                  strokeDasharray="5 5" 
                  strokeWidth={3}
                  className="stroke-muted dark:stroke-muted" 
                />
                <XAxis
                  dataKey="date"
                  className="text-muted-foreground dark:text-muted-foreground-dark"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                      className="bg-background dark:bg-background border border-muted dark:border-muted"
                    />
                  } 
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: 10,
                    fontSize: '0.875rem',
                  }}
                />
                {Object.keys(chartConfig).map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={chartConfig[key as keyof typeof chartConfig].color}
                    fill={chartConfig[key as keyof typeof chartConfig].color}
                    strokeWidth={5}
                    dot={{ 
                      r: 4, 
                      fill: chartConfig[key as keyof typeof chartConfig].color 
                    }}
                    connectNulls={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
            <div className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">No score data available</p>
              <p className="text-sm">Start practicing to see your IELTS score trends</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}