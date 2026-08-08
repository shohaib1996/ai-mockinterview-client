"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Clock, CheckCircle2 } from "lucide-react";
import {
  useGetSpeakingTestQuery,
  useChatSpeakingTestMutation,
  useSubmitSpeakingPart2Mutation,
  useAnalyzeSpeakingTestMutation,
} from "@/redux/api/speaking-test/speakingTestApi";
import { useGetSingleSessionQuery } from "@/redux/api/session/sessionApi";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { ChatBubble } from "@/components/UserDashboard/ChatBubble";

type Phase = "part1" | "part2-prep" | "part2-speaking" | "part3" | "analyzing" | "done";

interface Message {
  role: string;
  content: string;
}

interface AnalyzeResult {
  band: number;
  criteriaScores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  feedback: string;
}

const PREP_SECONDS = 60;
const PART2_SPEAKING_SECONDS = 120;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

interface SpeakingTestPageProps {
  sessionId: string;
}

const SpeakingTestPage = ({ sessionId }: SpeakingTestPageProps) => {
  const router = useRouter();
  const { data } = useGetSpeakingTestQuery(sessionId);
  const [chatSpeakingTest] = useChatSpeakingTestMutation();
  const [submitSpeakingPart2] = useSubmitSpeakingPart2Mutation();
  const [analyzeSpeakingTest] = useAnalyzeSpeakingTestMutation();
  const { isSpeaking, speak } = useTextToSpeech();

  const speakingTest = data?.data?.speakingTest;
  const session = data?.data?.session;
  const isReviewMode = !!session?.endedAt;

  const { data: fullSessionData } = useGetSingleSessionQuery(sessionId, { skip: !isReviewMode });
  const reviewConversation = fullSessionData?.data?.aiChatConversations?.[0]?.conversation ?? [];
  const reviewFeedback = fullSessionData?.data?.feedback as
    | { criteriaScores: AnalyzeResult["criteriaScores"]; feedback: string }
    | undefined;

  const [phase, setPhase] = useState<Phase>("part1");
  const [part1Conversation, setPart1Conversation] = useState<Message[]>([]);
  const [part3Conversation, setPart3Conversation] = useState<Message[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [prepTimeLeft, setPrepTimeLeft] = useState(PREP_SECONDS);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(PART2_SPEAKING_SECONDS);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const startedRef = useRef({ part1: false, part3: false });
  const part2TranscriptRef = useRef("");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const handlePart1Answer = async (transcript: string) => {
    if (!transcript.trim()) return;
    const userMessage: Message = { role: "user", content: transcript };
    const conversationForApi = [...part1Conversation, userMessage];
    setPart1Conversation((prev) => [...prev, userMessage]);
    setIsAiResponding(true);
    try {
      const res = await chatSpeakingTest({ sessionId, part: 1, conversation: conversationForApi }).unwrap();
      const aiMessage: Message = { role: "assistant", content: res.data.reply };
      setPart1Conversation((prev) => [...prev, aiMessage]);
      speak(res.data.reply);
      if (res.data.isPartComplete) {
        setTimeout(() => setPhase("part2-prep"), 1500);
      }
    } catch (error) {
      console.error("Failed to get examiner response:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAiResponding(false);
    }
  };

  const handlePart3Answer = async (transcript: string) => {
    if (!transcript.trim()) return;
    const userMessage: Message = { role: "user", content: transcript };
    const conversationForApi = [...part3Conversation, userMessage];
    setPart3Conversation((prev) => [...prev, userMessage]);
    setIsAiResponding(true);
    try {
      const res = await chatSpeakingTest({ sessionId, part: 3, conversation: conversationForApi }).unwrap();
      const aiMessage: Message = { role: "assistant", content: res.data.reply };
      setPart3Conversation((prev) => [...prev, aiMessage]);
      speak(res.data.reply);
      if (res.data.isPartComplete) {
        setTimeout(() => setPhase("analyzing"), 1500);
      }
    } catch (error) {
      console.error("Failed to get examiner response:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAiResponding(false);
    }
  };

  const handleTranscript = (transcript: string) => {
    if (phaseRef.current === "part1") handlePart1Answer(transcript);
    else if (phaseRef.current === "part2-speaking") part2TranscriptRef.current += ` ${transcript}`;
    else if (phaseRef.current === "part3") handlePart3Answer(transcript);
  };

  const { isListening, startListening, stopListening } = useSpeechToText({ onTranscript: handleTranscript });

  // Kick off Part 1 with the examiner's opening question once the test loads.
  useEffect(() => {
    if (!speakingTest || isReviewMode || startedRef.current.part1) return;
    startedRef.current.part1 = true;
    (async () => {
      setIsAiResponding(true);
      try {
        const res = await chatSpeakingTest({ sessionId, part: 1, conversation: [] }).unwrap();
        const aiMessage: Message = { role: "assistant", content: res.data.reply };
        setPart1Conversation([aiMessage]);
        speak(res.data.reply);
      } finally {
        setIsAiResponding(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakingTest, isReviewMode]);

  // Kick off Part 3 the same way once we reach it.
  useEffect(() => {
    if (phase !== "part3" || isReviewMode || startedRef.current.part3) return;
    startedRef.current.part3 = true;
    (async () => {
      setIsAiResponding(true);
      try {
        const res = await chatSpeakingTest({ sessionId, part: 3, conversation: [] }).unwrap();
        const aiMessage: Message = { role: "assistant", content: res.data.reply };
        setPart3Conversation([aiMessage]);
        speak(res.data.reply);
      } finally {
        setIsAiResponding(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isReviewMode]);

  // Part 2 prep countdown - silent, no mic active.
  useEffect(() => {
    if (phase !== "part2-prep") return;
    setPrepTimeLeft(PREP_SECONDS);
    const interval = setInterval(() => {
      setPrepTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase("part2-speaking");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const finishPart2 = async () => {
    stopListening();
    try {
      await submitSpeakingPart2({ sessionId, transcript: part2TranscriptRef.current.trim() }).unwrap();
    } catch (error) {
      console.error("Failed to submit part 2:", error);
    }
    setPhase("part3");
  };
  const finishPart2Ref = useRef(finishPart2);
  useEffect(() => {
    finishPart2Ref.current = finishPart2;
  });

  // Part 2 long turn - record automatically for up to 2 minutes.
  useEffect(() => {
    if (phase !== "part2-speaking") return;
    part2TranscriptRef.current = "";
    setSpeakTimeLeft(PART2_SPEAKING_SECONDS);
    startListening();
    const interval = setInterval(() => {
      setSpeakTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishPart2Ref.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Grade the full test once Part 3 wraps up.
  useEffect(() => {
    if (phase !== "analyzing") return;
    (async () => {
      try {
        const res = await analyzeSpeakingTest(sessionId).unwrap();
        setResult(res.data);
        setPhase("done");
      } catch (error) {
        console.error("Failed to analyze speaking test:", error);
        toast.error("Failed to analyze your speaking test. Please try again.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [part1Conversation, part3Conversation]);

  if (!speakingTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isReviewMode) {
    const partLabel = (part: number) =>
      part === 1 ? "Part 1: Introduction" : part === 2 ? "Part 2: Long Turn" : "Part 3: Discussion";

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-serif font-bold text-foreground">IELTS Speaking Test</h1>
            <Badge variant="secondary" className="text-sm">
              Review — Band {session?.score?.toFixed(1) ?? "N/A"}
            </Badge>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
          {reviewFeedback && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Fluency &amp; Coherence</p>
                    <p className="text-xl font-semibold">
                      {reviewFeedback.criteriaScores.fluencyCoherence}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Lexical Resource</p>
                    <p className="text-xl font-semibold">
                      {reviewFeedback.criteriaScores.lexicalResource}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Grammatical Range</p>
                    <p className="text-xl font-semibold">
                      {reviewFeedback.criteriaScores.grammaticalRange}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Pronunciation*</p>
                    <p className="text-xl font-semibold">
                      {reviewFeedback.criteriaScores.pronunciation}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  *Pronunciation is estimated from the transcript only, not from audio analysis.
                </p>
                <p className="text-sm text-muted-foreground">{reviewFeedback.feedback}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviewConversation.map((msg: any, index: number) => (
                <div key={index} className="space-y-1">
                  {(index === 0 || reviewConversation[index - 1].part !== msg.part) && (
                    <Badge variant="outline" className="text-xs">
                      {partLabel(msg.part)}
                    </Badge>
                  )}
                  <ChatBubble message={msg} />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button size="lg" onClick={() => router.push("/dashboard/ielts/speaking")} className="px-10 py-6 text-lg">
              Back to Speaking Practice
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-2xl">Speaking Test Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-6xl font-bold text-primary">{result.band.toFixed(1)}</div>
            <p className="text-muted-foreground">Estimated Band Score</p>
            <div className="grid grid-cols-2 gap-3 text-left text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Fluency &amp; Coherence</p>
                <p className="text-xl font-semibold">{result.criteriaScores.fluencyCoherence}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Lexical Resource</p>
                <p className="text-xl font-semibold">{result.criteriaScores.lexicalResource}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Grammatical Range</p>
                <p className="text-xl font-semibold">{result.criteriaScores.grammaticalRange}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-muted-foreground">Pronunciation*</p>
                <p className="text-xl font-semibold">{result.criteriaScores.pronunciation}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              *Pronunciation is estimated from the transcript only, not from audio analysis.
            </p>
            <p className="text-sm text-muted-foreground text-left">{result.feedback}</p>
            <Button onClick={() => router.push("/dashboard/ielts/speaking")} className="w-full">
              Back to Speaking Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "analyzing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="text-muted-foreground">Analyzing your speaking test...</p>
      </div>
    );
  }

  if (phase === "part2-prep" || phase === "part2-speaking") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-xl w-full">
          <CardHeader className="text-center">
            <Badge variant="secondary" className="mx-auto mb-2">Part 2: Individual Long Turn</Badge>
            <CardTitle className="text-2xl font-serif">{speakingTest.cueCardTopic}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">You should say:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {speakingTest.cueCardBullets.map((bullet: string, i: number) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>

            {phase === "part2-prep" ? (
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Preparation time — no need to speak yet</p>
                <div className="text-5xl font-mono font-bold text-primary">{formatTime(prepTimeLeft)}</div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex items-center justify-center gap-2 text-red-600"
                >
                  <Mic className="w-5 h-5" />
                  <span className="font-medium">Recording your answer...</span>
                </motion.div>
                <div className="text-5xl font-mono font-bold text-primary">{formatTime(speakTimeLeft)}</div>
                <Button onClick={finishPart2} variant="outline">
                  Finish Early
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const conversation = phase === "part1" ? part1Conversation : part3Conversation;

  return (
    <Card className="min-h-screen rounded-none border-0 flex flex-col">
      <CardHeader className="flex-row items-center justify-between border-b">
        <div>
          <CardTitle>IELTS Speaking Test</CardTitle>
          <Badge variant="secondary" className="mt-1">
            {phase === "part1" ? "Part 1: Introduction and Interview" : "Part 3: Two-Way Discussion"}
          </Badge>
        </div>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="flex-grow flex flex-col p-6">
        <ScrollArea className="flex-grow p-4 border rounded-md" ref={scrollAreaRef}>
          <div className="space-y-4">
            {conversation.map((msg, index) => (
              <ChatBubble key={index} message={msg} />
            ))}
            {isAiResponding && <ChatBubble message={{ role: "assistant", content: "" }} isLoading />}
          </div>
        </ScrollArea>

        <div className="pt-6 flex justify-center">
          <motion.div
            animate={{ scale: isListening ? [1.1, 1, 1.1] : 1 }}
            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          >
            <Button
              onClick={isListening ? stopListening : startListening}
              className="py-6 text-lg"
              disabled={isAiResponding || isSpeaking}
            >
              {isListening ? (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeakingTestPage;
