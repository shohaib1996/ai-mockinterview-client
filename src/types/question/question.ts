export type QuestionType =
  | "MCQ"
  | "OPEN_ENDED"
  | "TRUE_FALSE_NOT_GIVEN"
  | "MATCHING"
  | "COMPLETION"
  | "SHORT_ANSWER";

export type SessionTypeQ =
  | "IELTS_LISTENING"
  | "IELTS_READING"
  | "IELTS_WRITING"
  | "IELTS_SPEAKING"
  | "MOCK_INTERVIEW_TECHNICAL"
  | "MOCK_INTERVIEW_BEHAVIORAL"
  | "MOCK_INTERVIEW_INTERPERSONAL"
  | "QUIZ";

export type Difficulty = "LOW" | "MEDIUM" | "HIGH";

export interface IQuestion {
  id: string;
  type: QuestionType;
  sessionType: SessionTypeQ;
  text: string;
  options?: string[];
  correctAnswer?: string | string[];
  acceptableAnswers?: string[];
  difficulty: Difficulty;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  listeningAudioId?: string | null;
  readingPassageId?: string | null;
  quizAttemptId?: string | null;
}
