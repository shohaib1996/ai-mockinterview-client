type IELTSWritingTaskType = 'TASK1' | 'TASK2';
type Difficulty = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IWritingTask {
  id: string;
  task: IELTSWritingTaskType;
  promptText: string;
  imageUrl?: string | null;
  difficulty?: Difficulty;
}
