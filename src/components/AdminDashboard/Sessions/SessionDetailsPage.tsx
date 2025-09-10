"use client"

import { useGetSingleSessionQuery } from "@/redux/api/session/sessionApi"
import type { ISinglesSession } from "@/types"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { SessionHeader } from "./SessionHeader"
import { SessionFeedback } from "./SessionFeedback"
import { AiConversations } from "./AiConversations"

interface SessionDetailsPageProps {
  id: string
}

export function SessionDetailsPage({ id }: SessionDetailsPageProps) {
  const { data, isLoading } = useGetSingleSessionQuery(id)
  const session: ISinglesSession = data?.data || {}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-24">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <p className="text-lg font-medium">Loading session details...</p>
                <p className="text-sm text-muted-foreground">Please wait while we fetch your session data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!session.id) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex items-center justify-center py-24">
              <div className="text-center space-y-4">
                <p className="text-lg font-medium">Session not found</p>
                <p className="text-sm text-muted-foreground">
                  The session you&apos;re looking for doesn&apos;t exist or has been removed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Session Header */}
        <SessionHeader session={session} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <SessionFeedback feedback={session.feedback} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AiConversations conversations={session.aiChatConversations || []} />

            {/* Additional Session Data */}
            {session.userListeningHistory && session.userListeningHistory?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Listening History</h3>
                  <div className="space-y-2">
                    {session.userListeningHistory.map((history, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        Completed: {new Date(history.completedAt).toLocaleString()}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {session.writingSubmissions && session.writingSubmissions?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Writing Submissions</h3>
                  <div className="text-sm text-muted-foreground">
                    {session.writingSubmissions?.length} submission(s) available
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
