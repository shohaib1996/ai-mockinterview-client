type Difficulty = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ISpeakingTestBank {
  id: string;
  part1Topic: string;
  part1Questions: string[];
  cueCardTopic: string;
  cueCardBullets: string[];
  part2FollowUpQuestions: string[];
  part3Questions: string[];
  difficulty?: Difficulty;
  createdAt?: string;
}
