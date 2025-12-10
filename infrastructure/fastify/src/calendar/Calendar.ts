import { RepositoryResolverInterface } from '../../../../application/services/RepositoryResolverInterface';
import { SchedulerInterface } from '../../../../application/services/scheduler/SchedulerInterface';
import { ClaimBankCreditCronUsecase } from '../../../../application/usecases/crons/ClaimBankCreditCronUsecase';
import { ApplyInterestCronUsecase } from '../../../../application/usecases/crons/ApplyInterestCronUsecase';

export class Calendar {
  public constructor(
    private readonly repositoryResolver: RepositoryResolverInterface,
    private readonly scheduler: SchedulerInterface,
  ) {
    this.initInterestScheduler();
    this.initClaimBankCreditScheduler();
  }

  private async initInterestScheduler(): Promise<void> {
    const cronUsecase = new ApplyInterestCronUsecase(this.repositoryResolver, this.scheduler);
    cronUsecase.execute();
  }

  private async initClaimBankCreditScheduler(): Promise<void> {
    const cronUsecase = new ClaimBankCreditCronUsecase(this.repositoryResolver, this.scheduler);
    cronUsecase.execute();
  }
}
