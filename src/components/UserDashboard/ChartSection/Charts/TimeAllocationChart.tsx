"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Clock } from "lucide-react";
import React from "react";

interface TimeAllocationData {
  type: string;
  minutes: number;
}

interface TimeAllocationChartProps {
  data: TimeAllocationData[];
}

export function TimeAllocationChart({ data }: TimeAllocationChartProps) {
  // Define configuration for exactly 7 activities with specific colors
  const chartConfig = {
    ielts_listening: { label: "Listening", color: "hsl(221, 83%, 53%)" }, // Blue-500
    ielts_reading: { label: "Reading", color: "hsl(142, 76%, 36%)" }, // Green-600
    ielts_writing: { label: "Writing", color: "hsl(24, 94%, 50%)" }, // Orange-500
    ielts_speaking: { label: "Speaking", color: "hsl(280, 65%, 60%)" }, // Purple-500
    mock_interview_technical: { label: "Technical Interview", color: "hsl(200, 80%, 50%)" }, // Cyan-500
    mock_interview_behavioral: { label: "Behavioral Interview", color: "hsl(48, 89%, 50%)" }, // Yellow-500
    mock_interview_interpersonal: { label: "Interpersonal Interview", color: "hsl(0, 84%, 50%)" }, // Red-500
  };

  // Map data to ensure exactly 7 bars, filling missing activities with 0 minutes
  const formattedData = React.useMemo(() => {
    const activityMap = new Map<string, number>();
    data?.forEach((item) => {
      const key = item.type.toLowerCase().replace(/\s+/g, "_");
      if (chartConfig[key as keyof typeof chartConfig]) {
        activityMap.set(key, item.minutes);
      }
    });

    return Object.keys(chartConfig).map((key) => {
      const label = chartConfig[key as keyof typeof chartConfig].label;
      return {
        activity: label,
        time: activityMap.get(key) || 0,
        shortActivity: label?.length > 10 ? `${label.slice(0, 7)}...` : label,
        fill: chartConfig[key as keyof typeof chartConfig].color,
      };
    });
  }, [data]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const hasData = formattedData.some((item) => item.time > 0);

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
          <Clock className="h-5 w-5" />
          Time Allocation
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          How you distribute your practice time across different activities
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
                  dataKey="shortActivity"
                  className="text-muted-foreground dark:text-muted-foreground-dark"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  tickFormatter={(value, index) => formattedData[index]?.shortActivity || value}
                />
                <YAxis
                  className="text-muted-foreground dark:text-muted-foreground-dark"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickMargin={8}
                  tickFormatter={(value) => formatTime(value)}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload?.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background dark:bg-background-dark border border-muted dark:border-muted-dark rounded-lg p-2 sm:p-3 shadow-md">
                          <p className="text-foreground dark:text-foreground-dark font-medium">{data.activity}</p>
                          <p className="text-muted-foreground dark:text-muted-foreground-dark">Time: {formatTime(data.time)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: 10,
                    fontSize: "0.875rem",
                  }}
                />
                <Bar
                  dataKey="time"
                  radius={[4, 4, 0, 0]}
                  barSize={Math.max(30, 100 / Math.max(1, formattedData?.length))}
                >
                  {formattedData.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="time" fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
            <div className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg font-medium">No time data available</p>
              <p className="text-sm">Start practicing to see your time allocation</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}