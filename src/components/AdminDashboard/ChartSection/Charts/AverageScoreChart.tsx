"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AverageScoreChartProps {
  data: Array<{ label: string; value: number }> | undefined;
  isLoading: boolean;
}

const COLORS = {
  IELTS_LISTENING: "hsl(142, 76%, 36%)", // Green
  IELTS_READING: "hsl(221, 83%, 53%)", // Blue
  IELTS_SPEAKING: "hsl(262, 83%, 58%)", // Purple
  IELTS_WRITING: "hsl(346, 87%, 43%)", // Red
  MOCK_INTERVIEW_TECHNICAL: "hsl(35, 91%, 62%)", // Orange
  MOCK_INTERVIEW_BEHAVIORAL: "hsl(280, 100%, 70%)", // Magenta
  MOCK_INTERVIEW_INTERPERSONAL: "hsl(195, 100%, 50%)", // Cyan
  QUIZ: "hsl(45, 100%, 51%)", // Yellow
};

const SESSION_TYPE_DISPLAY = {
  IELTS_LISTENING: "IELTS Listening",
  IELTS_READING: "IELTS Reading",
  IELTS_SPEAKING: "IELTS Speaking",
  IELTS_WRITING: "IELTS Writing",
  MOCK_INTERVIEW_TECHNICAL: "Mock Technical Interview",
  MOCK_INTERVIEW_BEHAVIORAL: "Mock Behavioral Interview",
  MOCK_INTERVIEW_INTERPERSONAL: "Mock Interpersonal Interview",
  QUIZ: "Quiz",
};

const chartConfig = {
  value: {
    label: "Average Score",
    color: "hsl(346, 87%, 43%)", // Fallback red
  },
};

// const CustomLegend = ({ payload }: any) => {
//   const truncateText = (text: string, maxLength = 14) =>
//     text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

//   return (
//     <div className="flex flex-wrap justify-center gap-3 mt-4 px-2">
//       {payload?.map((entry: any) => (
//         <div
//           key={`legend-${entry.value}`}
//           className="flex items-center gap-1 text-[11px] sm:text-xs cursor-pointer group"
//           title={entry.value}
//         >
//           <div
//             className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
//             style={{ backgroundColor: entry.color }}
//           />
//           <span className="group-hover:text-foreground/80 transition-colors">
//             {truncateText(entry.value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload?.length) {
    const { label, value } = payload[0]?.payload;
    return (
      <div className="bg-background border rounded p-2 shadow text-xs sm:text-sm">
        <p className="font-semibold">{label}</p>
        <p>Average Score: {value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export function AverageScoreChart({ data, isLoading }: AverageScoreChartProps) {
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
    );
  }

  const formatSessionType = (label: string) => {
    const upperLabel = label.toUpperCase();
    return (
      SESSION_TYPE_DISPLAY[upperLabel as keyof typeof SESSION_TYPE_DISPLAY] ||
      label
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const allSessionTypes = Object.keys(SESSION_TYPE_DISPLAY).map((key) => ({
    label: formatSessionType(key),
    value: data?.find((item) => item.label.toUpperCase() === key)?.value || 0,
    fill: COLORS[key as keyof typeof COLORS],
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Average Score by Session Type
        </CardTitle>
        <CardDescription className="text-sm">
          Performance metrics across different sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {/* Make container responsive with minHeight */}
        <ChartContainer config={chartConfig} className="p-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={allSessionTypes}
              margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                className="text-[10px] sm:text-xs fill-muted-foreground"
                tick={{ fontSize: 10 }}
                interval={0}
                tickFormatter={(value) => {
                  const maxLength = 8;
                  return value?.length > maxLength
                    ? `${value.substring(0, maxLength)}…`
                    : value;
                }}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                className="text-[10px] sm:text-xs fill-muted-foreground"
                tick={{ fontSize: 10 }}
                domain={[0, "dataMax + 1"]}
              />
              <ChartTooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {allSessionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
