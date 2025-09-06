"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Lightbulb } from "lucide-react"

interface SessionFeedbackProps {
  feedback: string | null
}

export function SessionFeedback({ feedback }: SessionFeedbackProps) {
  if (!feedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            AI Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center space-y-2">
              <Lightbulb className="h-12 w-12 mx-auto opacity-50" />
              <p>No feedback available for this session</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          AI Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border bg-accent/5 p-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{feedback}</div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
