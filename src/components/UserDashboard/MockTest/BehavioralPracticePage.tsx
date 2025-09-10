'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/redux/hooks/hooks';
import {
  useAnalyzeConversationMutation,
  useChatMutation,
  useGetConversationHistoryQuery,
} from '@/redux/api/mock-interview/mockInterviewApi';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ChatBubble } from '@/components/UserDashboard/ChatBubble';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpdateSessionMutation } from '@/redux/api/session/sessionApi';
import { toast } from 'sonner';

const BehavioralPracticePage = ({ id: sessionId }: { id: string }) => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { data: initialConversation, isLoading: isHistoryLoading } =
    useGetConversationHistoryQuery(sessionId);
  const [chat, { isLoading: isAiResponding }] = useChatMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [analyzeChat] = useAnalyzeConversationMutation();
  const { isSpeaking, speak, cancel } = useTextToSpeech();

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage = { role: "user", content };
    const conversationForApi = [...conversation, userMessage];

    try {
      const res = await chat({
        sessionId: sessionId,
        data: { conversation: conversationForApi },
      }).unwrap();

      const aiMessage = { role: "assistant", content: res.data };

      // Single, safe state update with both the user message and AI response
      setConversation((prev) => [...prev, userMessage, aiMessage]);
      
      speak(res.data);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      // In case of error, still add the user message
      setConversation((prev) => [...prev, userMessage, errorMessage]);
    }
  }, [conversation, chat, sessionId, speak]);

  const handleTranscript = useCallback((transcript: string) => {
    if (transcript) {
      handleSendMessage(transcript);
    }
  }, [handleSendMessage]);

  const { isListening, startListening, stopListening } = useSpeechToText({
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    if (initialConversation?.data && initialConversation.data?.length > 0) {
      setConversation(initialConversation.data);
      setPracticeStarted(true);
    } else if (user && !practiceStarted && !isHistoryLoading) {
      setPracticeStarted(true);
      const initialMessage = {
        role: 'user',
        content: 'Ask me question one by one',
      };
      handleSendMessage(initialMessage.content);
    }
  }, [initialConversation, user, practiceStarted, isHistoryLoading, handleSendMessage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation]);

  const handleTapToSpeak = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleCloseAndAnalyze = async () => {
    setIsClosing(true);
    const toastId = toast.loading('Analyzing conversation, please wait...');

    try {
      await analyzeChat(sessionId).unwrap();
      toast.success('Analysis complete. Saving session...', { id: toastId });

      await updateSession({
        id: sessionId,
        endedAt: new Date().toISOString(),
      }).unwrap();

      toast.success('Session saved successfully!', { id: toastId });
      router.push('/dashboard/mock-test/behavioral');
    } catch (error) {
      console.error('Failed to close and analyze session:', error);
      toast.error('An error occurred during analysis. Please try again.', {
        id: toastId,
      });
    } finally {
      setIsClosing(false);
    }
  };

  if (isHistoryLoading) {
    return (
      <div className='p-6'>
        <Skeleton className='h-16 w-full mb-4' />
        <Skeleton className='h-96 w-full' />
      </div>
    );
  }

  return (
    <Card className='flex flex-col'>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle>Behavioral Mock Interview</CardTitle>
        <div className='flex items-center gap-4'>
          <Button
            onClick={isSpeaking ? cancel : () => speak(conversation[conversation?.length - 1]?.content)}
            variant='outline'
            size='icon'
            disabled={!conversation?.length}
          >
            {isSpeaking ? <VolumeX /> : <Volume2 />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='flex-grow flex flex-col'>
        <ScrollArea className='flex-grow p-4 border rounded-md' ref={scrollAreaRef}>
          <div className='space-y-4'>
            {conversation?.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
            {isAiResponding && (
              <ChatBubble message={{ role: 'assistant', content: '' }} isLoading />
            )}
          </div>
        </ScrollArea>

        <div className='pt-4 flex justify-center gap-4'>
          <Button
            variant='destructive'
            className='py-6 text-lg'
            onClick={handleCloseAndAnalyze}
            disabled={isClosing}
          >
            {isClosing ? 'Analyzing...' : 'Close and Analyze'}
          </Button>
          <motion.div
            animate={{ scale: isListening ? [1.1, 1, 1.1] : 1 }}
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          >
            <Button
              onClick={handleTapToSpeak}
              className='py-6 text-lg'
              disabled={isAiResponding || isClosing}
            >
              {isListening ? (
                <>
                  <MicOff className='mr-2' /> Stop Listening
                </>
              ) : (
                <>
                  <Mic className='mr-2' /> Tap to Speak
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralPracticePage;
