"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Calendar, Trophy, User } from "lucide-react"
import { SessionType } from "@/types"

interface SessionHeaderProps {
  session: {
    id: string
    type: SessionType
    startedAt: string
    endedAt: string
    score: number
    userId: string
  }
}

const getSessionTypeDisplay = (type: SessionType) => {
  const typeMap = {
    [SessionType.IELTS_LISTENING]: "IELTS Listening",
    [SessionType.IELTS_READING]: "IELTS Reading",
    [SessionType.IELTS_WRITING]: "IELTS Writing",
    [SessionType.IELTS_SPEAKING]: "IELTS Speaking",
    [SessionType.MOCK_INTERVIEW_TECHNICAL]: "Mock Technical",
    [SessionType.MOCK_INTERVIEW_BEHAVIORAL]: "Mock Behavioral",
    [SessionType.MOCK_INTERVIEW_INTERPERSONAL]: "Mock Interpersonal",
    [SessionType.QUIZ]: "Quiz",
  }
  return typeMap[type] || type
}

const getSessionTypeColor = (type: SessionType) => {
  if (type.includes("IELTS")) return "bg-chart-1 text-white"
  if (type.includes("MOCK_INTERVIEW")) return "bg-chart-2 text-white"
  return "bg-chart-3 text-white"
}

export function SessionHeader({ session }: SessionHeaderProps) {
  const duration = new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()
  const durationMinutes = Math.round(duration / (1000 * 60))

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`px-4 py-2 text-sm font-semibold ${getSessionTypeColor(session.type)}`}>
                {getSessionTypeDisplay(session.type)}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Session #{session.id.slice(-8)}
              </Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-balance">
              {getSessionTypeDisplay(session.type)} Session
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(session.startedAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(session.startedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(session.endedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{durationMinutes} minutes</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-muted-foreground">Final Score</span>
              </div>
              <div className="text-4xl font-black text-primary">
                {session.score}
                <span className="text-lg text-muted-foreground">/9</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
