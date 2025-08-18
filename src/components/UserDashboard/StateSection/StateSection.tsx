import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Target,
  MessageSquare,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface StatsData {
  avgListeningScore: number
  avgReadingScore: number
  avgWritingScore: number
  avgSpeakingScore: number
  overallIeltsBand: number
  avgMockInterviewScore: number
  totalSessionsCompleted: number
  totalQuizzesTaken: number
  quizAccuracy: number
  strongestSkill: string
  weakestSkill: string
  totalTimePracticed: number
}

interface StatsSectionProps {
  statsData: StatsData
}

export function StatsSection({ statsData }: StatsSectionProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case "IELTS_LISTENING":
        return <Headphones className="h-4 w-4" />
      case "IELTS_READING":
        return <BookOpen className="h-4 w-4" />
      case "IELTS_WRITING":
        return <PenTool className="h-4 w-4" />
      case "IELTS_SPEAKING":
        return <Mic className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const formatSkillName = (skill: string) => {
    return skill
      .replace("IELTS_", "")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())
  }

  const stats = [
    {
      title: "Listening Score",
      value: statsData?.avgListeningScore?.toFixed(1) || "0.0",
      icon: <Headphones className="h-4 w-4" />,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Reading Score",
      value: statsData?.avgReadingScore?.toFixed(1) || "0.0",
      icon: <BookOpen className="h-4 w-4" />,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Writing Score",
      value: statsData?.avgWritingScore?.toFixed(1) || "0.0",
      icon: <PenTool className="h-4 w-4" />,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Speaking Score",
      value: statsData?.avgSpeakingScore?.toFixed(1) || "0.0",
      icon: <Mic className="h-4 w-4" />,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Overall IELTS Band",
      value: statsData?.overallIeltsBand?.toString() || "0",
      icon: <Target className="h-4 w-4" />,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Mock Interview Score",
      value: statsData?.avgMockInterviewScore?.toFixed(1) || "0.0",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Sessions Completed",
      value: statsData?.totalSessionsCompleted?.toString() || "0",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Quiz Accuracy",
      value: `${statsData?.quizAccuracy || 0}%`,
      icon: <Target className="h-4 w-4" />,
      color: "text-cyan-600 dark:text-cyan-400",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Performance Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={stat.color}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              Strongest Skill
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getSkillIcon(statsData?.strongestSkill)}
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {formatSkillName(statsData?.strongestSkill || "")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              Needs Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getSkillIcon(statsData?.weakestSkill)}
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {formatSkillName(statsData?.weakestSkill || "")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Time Practiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTime(statsData?.totalTimePracticed || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">{statsData?.totalQuizzesTaken || 0} quizzes taken</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
