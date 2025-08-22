export interface ListeningAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  answerText: string;
  isCorrect: boolean;
  score: number;
  feedback: string | null;
  createdAt: string; // ISO date string
}
