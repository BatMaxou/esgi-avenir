import { RepositoryResolverInterface } from '../../../application/services/RepositoryResolverInterface';
import { SchedulerInterface } from '../../../application/services/scheduler/SchedulerInterface';
import { ApplyInterestUsecase } from '../../../application/usecases/operation/ApplyInterestUsecase';
import { ClaimBankCreditUsecase } from '../../../application/usecases/bank-credit/ClaimBankCreditUsecase';

export class Calendar {
  public constructor(
    private readonly repositoryResolver: RepositoryResolverInterface,
    private readonly scheduler: SchedulerInterface,
  ) {
    this.initInterstScheduler();
    this.initClaimBankCreditScheduler();
  }

  private async initInterstScheduler(): Promise<void> {
    const usecase = new ApplyInterestUsecase(
      this.repositoryResolver.getAccountRepository(),
      this.repositoryResolver.getOperationRepository(),
      this.repositoryResolver.getSettingRepository(),
    );

    this.scheduler.schedule('0 2 * * *', () => usecase.execute());
  }

  private async initClaimBankCreditScheduler(): Promise<void> {
    const usecase = new ClaimBankCreditUsecase(
      this.repositoryResolver.getOperationRepository(),
      this.repositoryResolver.getBankCreditRepository(),
      this.repositoryResolver.getMonthlyPaymentRepository(),
    )

    this.scheduler.schedule('* 3 1 * *', () => usecase.execute());
  }
}
