import { SchedulerInterface } from '../../../application/services/scheduler/SchedulerInterface';

export class Calendar {
  public constructor(scheduler: SchedulerInterface) {
    scheduler.schedule('* * * * *', async () => {
      console.log('Calendar task executed every minute');
    });
  }
}
