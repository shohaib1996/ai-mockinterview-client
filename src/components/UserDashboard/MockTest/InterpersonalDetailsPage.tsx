'use client';

import { useGetSingleSessionQuery } from '@/redux/api/session/sessionApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, MessageSquare, Star, User, Bot, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { AiChatConversation, ISinglesSession } from '@/types';

const InterpersonalDetailsPage = ({ id }: { id: string }) => {
  const [selectedConversation, setSelectedConversation] = useState<AiChatConversation | null>(null);
  const { data, isLoading, isError, error } = useGetSingleSessionQuery(id);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading session data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">Error loading session: {(error as any)?.message || "Unknown error"}</p>
      </div>
    );
  }

  // Safely access session data
  const sessionData: ISinglesSession = data?.data || {
    id: "",
    type: "",
    startedAt: "",
    endedAt: "",
    score: 0,
    feedback: "",
    aiChatConversations: [],
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return "N/A";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} minutes`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "bg-green-500";
    if (score >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 4) return "Excellent";
    if (score >= 3) return "Good";
    if (score >= 2) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-balance">Interpersonal Interview Details</h1>
        <p className="text-muted-foreground">Session ID: {sessionData.id || "N/A"}</p>
      </div>

      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{sessionData.type?.replace(/_/g, " ") || "N/A"}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Started: {formatDate(sessionData.startedAt)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Ended: {formatDate(sessionData.endedAt)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duration: {calculateDuration(sessionData.startedAt, sessionData.endedAt)}
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium">Score:</span>
                <Badge className={`${getScoreColor(sessionData.score)} text-white`}>
                  {sessionData.score}/5 - {getScoreText(sessionData.score)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Feedback</CardTitle>
          <CardDescription>Detailed assessment and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-sm leading-relaxed">{sessionData.feedback || "No feedback available"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Interview Conversations
          </CardTitle>
          <CardDescription>{sessionData.aiChatConversations?.length} conversation(s) recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessionData.aiChatConversations?.length > 0 ? (
              sessionData.aiChatConversations.map((conversation, index) => (
                <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Conversation {index + 1}</h4>
                    <p className="text-sm text-muted-foreground">
                      {conversation.conversation?.length} messages • Started {formatDate(conversation.createdAt)}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        View Conversation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>Interview Conversation {index + 1}</DialogTitle>
                        <DialogDescription>
                          Started on {formatDate(selectedConversation?.createdAt || "")}
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[60vh] w-full pr-4">
                        <div className="space-y-4">
                          {selectedConversation?.conversation.map((message, msgIndex) => (
                            <div key={msgIndex} className="space-y-2">
                              <div
                                className={`flex items-start gap-3 ${
                                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                              >
                                <div
                                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    message.role === "user"
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-secondary-foreground"
                                  }`}
                                >
                                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </div>
                                <div
                                  className={`flex-1 space-y-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                                >
                                  <p className="text-sm font-medium capitalize">{message.role}</p>
                                  <div
                                    className={`inline-block p-3 rounded-lg max-w-[80%] ${
                                      message.role === "user"
                                        ? "bg-primary text-primary-foreground ml-auto"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  </div>
                                </div>
                              </div>
                              {msgIndex < (selectedConversation?.conversation?.length || 0) - 1 && (
                                <Separator className="my-4" />
                              )}
                            </div>
                          )) || <p>No messages available</p>}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No conversations available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterpersonalDetailsPage;