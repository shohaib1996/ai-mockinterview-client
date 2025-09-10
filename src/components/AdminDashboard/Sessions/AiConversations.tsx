"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Bot, User, MessageSquareText } from "lucide-react"
import { useState } from "react"

interface ConversationMessage {
  role: "user" | "assistant"
  content: string
}

interface AiChatConversation {
  id: string
  sessionId: string
  conversation: ConversationMessage[]
  createdAt: string
}

interface AiConversationsProps {
  conversations: AiChatConversation[]
}

export function AiConversations({ conversations }: AiConversationsProps) {
  const [openConversations, setOpenConversations] = useState<string[]>([])

  const toggleConversation = (id: string) => {
    setOpenConversations((prev) => (prev.includes(id) ? prev.filter((convId) => convId !== id) : [...prev, id]))
  }

  if (!conversations || conversations?.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center space-y-2">
              <MessageSquareText className="h-12 w-12 mx-auto opacity-50" />
              <p>No AI conversations in this session</p>
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
          <Bot className="h-5 w-5" />
          AI Conversations
          <Badge variant="secondary" className="ml-2">
            {conversations?.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conversations.map((conversation) => (
          <Collapsible
            key={conversation.id}
            open={openConversations.includes(conversation.id)}
            onOpenChange={() => toggleConversation(conversation.id)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Bot className="h-4 w-4 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Conversation #{conversation.id.slice(-8)}</p>
                  <p className="text-sm text-muted-foreground">{new Date(conversation.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {conversation.conversation?.length} messages
                </Badge>
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
              <ScrollArea className="h-72 w-full rounded-md border bg-popover p-4">
                <div className="space-y-4">
                  {conversation.conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[80%] gap-2 ${
                          message.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  )
}
