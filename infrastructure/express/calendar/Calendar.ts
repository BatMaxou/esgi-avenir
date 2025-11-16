import { RepositoryResolverInterface } from '../../../application/services/RepositoryResolverInterface';
import { SchedulerInterface } from '../../../application/services/scheduler/SchedulerInterface';
import { ApplyInterestUsecase } from '../../../application/usecases/operation/ApplyInterestUsecase';

export class Calendar {
  public constructor(
    private readonly repositoryResolver: RepositoryResolverInterface,
    private readonly scheduler: SchedulerInterface,
  ) {
    this.initInterstScheduler();
  }

  private async initInterstScheduler(): Promise<void> {
    const usecase = new ApplyInterestUsecase(
      this.repositoryResolver.getAccountRepository(),
      this.repositoryResolver.getOperationRepository(),
      this.repositoryResolver.getSettingRepository(),
    );
    
    this.scheduler.schedule('* * * * *', () => usecase.execute());
  }
}
