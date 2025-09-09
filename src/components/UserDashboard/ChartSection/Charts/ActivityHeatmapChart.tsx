"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface ActivityHeatmapData {
  date: string
  count: number
}

interface ActivityHeatmapChartProps {
  data: ActivityHeatmapData[]
}

export function ActivityHeatmapChart({ data }: ActivityHeatmapChartProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; count: number; x: number; y: number } | null>(null)

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted hover:bg-muted/80"
    if (count <= 2) return "bg-green-200 dark:bg-green-900 hover:bg-green-300 dark:hover:bg-green-800"
    if (count <= 4) return "bg-green-300 dark:bg-green-800 hover:bg-green-400 dark:hover:bg-green-700"
    if (count <= 6) return "bg-green-400 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600"
    return "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500"
  }

  // Group data by date for easier lookup
  const activityMap = React.useMemo(() => {
    const map = new Map<string, number>()
    data?.forEach(({ date, count }) => {
      const dateKey = new Date(date).toDateString()
      map.set(dateKey, (map.get(dateKey) || 0) + count)
    })
    return map
  }, [data])

  // Generate calendar grid for the last 12 weeks
  const generateCalendarData = () => {
    const weeks = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 83) // 12 weeks ago

    for (let week = 0; week < 12; week++) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + week * 7 + day)
        const dateKey = currentDate.toDateString()
        const count = activityMap.get(dateKey) || 0

        weekData.push({
          date: currentDate,
          count,
          dateKey,
        })
      }
      weeks.push(weekData)
    }
    return weeks
  }

  const calendarData = generateCalendarData()
  const totalActivities = data?.reduce((sum, item) => sum + item.count, 0) || 0

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleMouseEnter = (day: any, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setHoveredDay({
      date: day.date,
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    })
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
          <Calendar className="h-5 w-5" />
          Activity Heatmap
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Your practice consistency over the last 12 weeks ({totalActivities} total activities)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        <div className="space-y-4">
          <div className="flex gap-1">
            {/* Day labels column */}
            <div className="flex flex-col gap-1 mr-1 sm:mr-2">
              <div className="h-4 sm:h-5"></div> {/* Spacer for alignment */}
              {dayLabels.map((label, index) => (
                <div
                  key={label}
                  className="h-4 sm:h-5 w-6 sm:w-8 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground-dark flex items-center"
                >
                  {index % 2 === 1 ? label : ""}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex gap-0.5 sm:gap-1 flex-1 overflow-x-auto pb-2">
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1 min-w-[24px] sm:min-w-[32px]">
                  {/* Month labels */}
                  {weekIndex === 0 || week[0].date.getDate() <= 7 ? (
                    <div className="h-4 sm:h-5 text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground-dark text-center">
                      {week[0].date.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  ) : (
                    <div className="h-4 sm:h-5"></div>
                  )}

                  {/* Week column */}
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-[38px] md:h-[44px] rounded-sm ${getIntensityClass(
                        day.count
                      )} border border-border/50 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-border`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground dark:text-muted-foreground-dark">
            <span>Less</span>
            <div className="flex gap-0.5 sm:gap-1">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-muted border border-border/50" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-green-200 dark:bg-green-900 border border-border/50" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-green-300 dark:bg-green-800 border border-border/50" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-green-400 dark:bg-green-700 border border-border/50" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-green-500 dark:bg-green-600 border border-border/50" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>

      {hoveredDay && (
        <div
          className="fixed z-50 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-popover text-popover-foreground border border-border rounded-md shadow-lg pointer-events-none"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="font-medium">
            {hoveredDay.date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-muted-foreground dark:text-muted-foreground-dark">
            {hoveredDay.count} {hoveredDay.count === 1 ? "activity" : "activities"}
          </div>
        </div>
      )}
    </Card>
  )
}