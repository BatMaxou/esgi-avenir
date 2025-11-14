export interface SchedulerInterface {
  schedule(expression: string, task: () => void): Promise<void>;
}

