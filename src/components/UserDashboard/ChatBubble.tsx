"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppSelector } from "@/redux/hooks/hooks"

interface ChatBubbleProps {
  message: {
    role: string
    content: string
  }
  isLoading?: boolean
}

export const ChatBubble = ({ message, isLoading = false }: ChatBubbleProps) => {
  const user = useAppSelector((state) => state.auth.user)
  const { role, content } = message
  const isUser = role === "user"

  return (
    <div className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`rounded-lg px-4 py-2 max-w-[75%] ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
        {isLoading ? (
          <div className="dot-flashing"></div>
        ) : (
          <p className="text-sm">{content}</p>
        )}
      </div>
      {isUser && (
        <Avatar>
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
