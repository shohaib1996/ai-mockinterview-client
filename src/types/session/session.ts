export enum SessionType {
  IELTS_LISTENING = "IELTS_LISTENING",
  IELTS_READING = "IELTS_READING",
  IELTS_WRITING = "IELTS_WRITING",
  IELTS_SPEAKING = "IELTS_SPEAKING",
  MOCK_INTERVIEW_TECHNICAL = "MOCK_INTERVIEW_TECHNICAL",
  MOCK_INTERVIEW_BEHAVIORAL = "MOCK_INTERVIEW_BEHAVIORAL",
  MOCK_INTERVIEW_INTERPERSONAL = "MOCK_INTERVIEW_INTERPERSONAL",
  QUIZ = "QUIZ",
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: SessionType;
  startedAt: string; // ISO date string
  endedAt: string;   // ISO date string
  score: number;
  transcript: string | null;
  feedback: string | null;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}
