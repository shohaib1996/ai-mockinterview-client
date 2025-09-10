"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import {  Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector } from "@/redux/hooks/hooks"
import { useCreateChatCompletionMutation, useGetConversationBySessionIdQuery, useGetScoreAndFeedbackMutation } from "@/redux/api/ai-chat/aiChatApi"
import { useUpdateSessionMutation } from "@/redux/api/session/sessionApi"
import type { InterviewSession } from "@/types"
import { differenceInSeconds } from "date-fns"
import { useSpeechToText } from "@/hooks/useSpeechToText"
import { useTextToSpeech } from "@/hooks/useTextToSpeech"
import { ChatBubble } from "./ChatBubble"
import { toast } from "sonner"

interface SpeakingPracticeModalProps {
  session: InterviewSession
  onClose: () => void
}

export const SpeakingPracticeModal = ({ session, onClose }: SpeakingPracticeModalProps) => {
  const user = useAppSelector((state) => state.auth.user)
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [practiceStarted, setPracticeStarted] = useState(false)

  const { data: initialConversation } = useGetConversationBySessionIdQuery(session.id)
  const [createChatCompletion, { isLoading: isAiResponding }] = useCreateChatCompletionMutation()
  const [getScoreAndFeedback, { isLoading: isAnalyzing }] = useGetScoreAndFeedbackMutation()
  const [updateSession, { isLoading: isUpdatingSession }] = useUpdateSessionMutation()
  const { isSpeaking, speak, cancel } = useTextToSpeech()
  const [analysisTriggered, setAnalysisTriggered] = useState(false)

  // Initialize speech-to-text with transcript handler
  const handleTranscript = (transcript: string) => {
    console.log("Transcript received:", transcript)
    handleSendMessage(transcript)
  }

  const { isListening, startListening, stopListening } = useSpeechToText({ onTranscript: handleTranscript })

  // Load initial conversation
  useEffect(() => {
    if (initialConversation?.data) {
      setConversation(initialConversation.data)
    }
  }, [initialConversation?.data])

  // Timer for session duration
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = differenceInSeconds(new Date(session.endedAt), new Date())
      setTimeLeft(seconds > 0 ? seconds : 0)
      if (seconds <= 0 && practiceStarted) {
        clearInterval(interval)
        stopListening() // Stop listening when time runs out
        if (!analysisTriggered) {
          setAnalysisTriggered(true)
          getScoreAndFeedback(session.id).unwrap()
            .then(async (res) => {
              const { score, feedback } = res
              await updateSession({ id: session.id, score, feedback }).unwrap()
              toast.success("Session updated with score and feedback")
            })
            .catch((error) => {
              console.error("Failed to analyze or update session:", error)
            })
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [session.endedAt, stopListening])

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" })
    }
  }, [conversation])

  // Handle sending message to AI
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage = { role: "user", content }
    setConversation((prev) => [...prev, userMessage])

    try {
      const res = await createChatCompletion({ sessionId: session.id, conversation: [userMessage] }).unwrap()
      const aiMessage = { role: "assistant", content: res.data }
      setConversation((prev) => [...prev, aiMessage])
      speak(res.data)
    } catch (error) {
      console.error("Failed to get AI response:", error)
      const errorMessage = { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
      setConversation((prev) => [...prev, errorMessage])
    }
  }

  // Handle tap-to-speak button
  const handleTapToSpeak = () => {
    console.log("handleTapToSpeak called, isListening:", isListening, "practiceStarted:", practiceStarted)

    if (!practiceStarted) {
      const initialMessage = `I am ${user?.name}. I want to practice IELTS speaking. Ask me some random questions for that.`
      handleSendMessage(initialMessage)
      setPracticeStarted(true)
    } else {
      if (isListening) {
        stopListening()
        console.log("Stopping listening")
      } else {
        startListening()
        console.log("Starting listening")
      }
    }
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle>IELTS Speaking Practice</DialogTitle>
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-primary">Time Left: {formatTime(timeLeft)}</div>
            <Button
              onClick={isSpeaking ? cancel : () => speak(conversation[conversation.length - 1]?.content)}
              variant="outline"
              size="icon"
            >
              {isSpeaking ? <VolumeX /> : <Volume2 />}
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-grow p-4 border rounded-md overflow-y-auto" ref={scrollAreaRef}>
          <div className="space-y-4">
            {conversation?.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
            {isAiResponding && <ChatBubble message={{ role: "assistant", content: "..." }} isLoading />}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <motion.div
            animate={{ scale: isListening ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
            className="w-full"
          >
            <Button
              onClick={handleTapToSpeak}
              className="w-full py-6 text-lg"
              disabled={timeLeft === 0 || isAiResponding || isAnalyzing || isUpdatingSession}
            >
              {!practiceStarted ? (
                <>
                  <Mic className="mr-2" /> Start Practice
                </>
              ) : isListening ? (
                <>
                  <MicOff className="mr-2" /> Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2" /> Tap to Speak
                </>
              )}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}