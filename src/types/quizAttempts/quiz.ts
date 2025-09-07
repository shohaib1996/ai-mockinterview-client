import { IQuestion } from "../question/question";

interface Feedback {
  comment: string;
}

export interface IQuizAnswer {
  id: string;
  quizAttemptId: string;
  questionId: string;
  selectedOption?: string;
  answerText?: string;
  isCorrect: boolean;
  score: number;
  feedback: Feedback;
  createdAt: string;
  question: IQuestion;
}

export interface IQuizAttempt {
  id: string;
  userId: string;
  quizName: string;
  startedAt: string;
  endedAt: string | null;
  score: number | null;
  feedback: string | null;
  createdAt: string;
  quizAnswers: IQuizAnswer[];
  user: {
    name: string;
    email: string;
  };
}
