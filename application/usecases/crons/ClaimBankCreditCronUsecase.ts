import { RepositoryResolverInterface } from "../../services/RepositoryResolverInterface";
import { SchedulerInterface } from "../../services/scheduler/SchedulerInterface";
import { ClaimBankCreditUsecase } from "../../usecases/bank-credit/ClaimBankCreditUsecase";

export class ClaimBankCreditCronUsecase {
  public constructor(
    private readonly repositoryResolver: RepositoryResolverInterface,
    private readonly scheduler: SchedulerInterface,
  ) {}

  public async execute(): Promise<void> {
    const usecase = new ClaimBankCreditUsecase(
      this.repositoryResolver.getOperationRepository(),
      this.repositoryResolver.getBankCreditRepository(),
      this.repositoryResolver.getMonthlyPaymentRepository(),
    )

    this.scheduler.schedule('* * * * *', () => usecase.execute());
    // this.scheduler.schedule('* 3 1 * *', () => usecase.execute());
  }
}

