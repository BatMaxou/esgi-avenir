import { RepositoryResolverInterface } from "../../services/RepositoryResolverInterface";
import { SchedulerInterface } from "../../services/scheduler/SchedulerInterface";
import { ApplyInterestUsecase } from '../../../application/usecases/operation/ApplyInterestUsecase';

export class ApplyInterestCronUsecase {
  public constructor(
    private readonly repositoryResolver: RepositoryResolverInterface,
    private readonly scheduler: SchedulerInterface,
  ) {}

  public async execute(): Promise<void> {
    const usecase = new ApplyInterestUsecase(
      this.repositoryResolver.getAccountRepository(),
      this.repositoryResolver.getOperationRepository(),
      this.repositoryResolver.getSettingRepository(),
    );

    this.scheduler.schedule('* * * * *', () => usecase.execute());
    // this.scheduler.schedule('0 2 * * *', () => usecase.execute());
  }
}

