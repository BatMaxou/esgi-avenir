import cron from "node-cron";

import { SchedulerInterface } from "../../../../application/services/scheduler/SchedulerInterface";

export class Scheduler implements SchedulerInterface {
  public async schedule(expression: string, task: () => void): Promise<void> {
    cron.schedule(expression, task);
  }
}
