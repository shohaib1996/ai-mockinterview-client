enum IELTSWritingTaskType {
  TASK1,
  TASK2,
}
enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}

export interface IWritingTask {
  id: string;
  task: IELTSWritingTaskType;
  promptText: string;
  imageUrl?: string | null;
  difficulty?: Difficulty;
}
