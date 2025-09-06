export interface AdminDashboardStats {
  totalUsers: number;
  weeklyActiveUsers: number;
  totalSessions: number;
  pendingWritingSubmissions: number;
  totalMockInterviews: number;
  totalIeltsSessions: number;
  totalQuestions: number;
  newUsersToday: number;
}


type LabeledValue = {
  label: string;
  value: number;
};

interface UserCompletion {
  completed: number;
  total: number;
}

export interface AdminDashboardAnalytics {
  userSignupsLast30Days: LabeledValue[];
  sessionTypeDistribution: LabeledValue[];
  dailyActiveUsersLast30Days: LabeledValue[];
  questionDifficultyDistribution: LabeledValue[];
  userEngagementByHour: LabeledValue[];
  averageScoreBySessionType: LabeledValue[];
  aiVsManualQuestions: LabeledValue[];
  userCompletionHistory: {
    listening: UserCompletion;
    reading: UserCompletion;
  };
}


