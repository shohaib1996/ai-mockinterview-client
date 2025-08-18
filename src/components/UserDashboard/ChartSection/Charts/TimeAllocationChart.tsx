"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Clock } from "lucide-react";

interface TimeAllocationData {
  type: string;
  minutes: number;
}

interface TimeAllocationChartProps {
  data: TimeAllocationData[];
}

export function TimeAllocationChart({ data }: TimeAllocationChartProps) {
  // Map data to match chart expectations (type -> activity, minutes -> time)
  const formattedData = data.map((item) => ({
    activity: item.type,
    time: item.minutes,
    shortActivity: item.type.length > 10 ? `${item.type.slice(0, 7)}...` : item.type, // Shorten long labels
  }));

  const chartConfig = {
    time: {
      label: "Time (minutes)",
      color: "hsl(var(--chart-1))",
    },
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const hasData = formattedData && formattedData.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Allocation
        </CardTitle>
        <CardDescription>How you distribute your practice time across different activities</CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="shortActivity" // Use shortened label for XAxis
                  className="text-muted-foreground"
                  fontSize={12}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value, index) => formattedData[index]?.shortActivity || value}
                />
                <YAxis
                  className="text-muted-foreground"
                  fontSize={12}
                  tickFormatter={(value) => formatTime(value)}
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                          <p className="text-foreground font-medium">{data.activity}</p> {/* Show full activity name */}
                          <p className="text-muted-foreground">Time: {formatTime(data.time)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="time" fill="var(--color-time)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No time data available</p>
              <p className="text-sm">Start practicing to see your time allocation</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}