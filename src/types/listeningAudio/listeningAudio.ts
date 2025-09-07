
export interface IListeningAudio {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  createdAt: string;
}

export interface IUserListeningHistory {
  id: string;
  userId: string;
  sessionId: string;
  listeningAudioId: string;
  completedAt: string; // ISO date string
}

export interface IReadingPassage {
  id: string;
  title: string;
  content: string;
  createdAt: string; 
}
