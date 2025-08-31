type QuestionType =
  | "MCQ"

type SessionType =
  | "IELTS_LISTENING"
  | "IELTS_READING"
  | "IELTS_WRITING"
  | "IELTS_SPEAKING"
  | "MOCK_INTERVIEW_TECHNICAL"
  | "MOCK_INTERVIEW_BEHAVIORAL"
  | "MOCK_INTERVIEW_INTERPERSONAL"
  | "QUIZ";

type Difficulty = "LOW" | "MEDIUM" | "HARD";

export interface IQuestion {
  id: string;
  type: QuestionType;
  sessionType: SessionType;
  text: string;
  options?: string[]; 
  correctAnswer?: string | string[];
  difficulty: Difficulty;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  listeningAudioId?: string | null;
  readingPassageId?: string | null;
  quizAttemptId?: string | null;
}
