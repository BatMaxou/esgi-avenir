import { FinancialSecurity } from '../../../domain/entities/FinancialSecurity';
import { User } from '../../../domain/entities/User';
import { FinancialSecurityRepositoryInterface } from '../../repositories/FinancialSecurityRepositoryInterface';

export class GetFinancialSecurityListUsecase {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
  ): Promise<FinancialSecurity[]> {
    if (!owner.id) {
      return [];
    }

    return await this.financialSecurityRepository.findAllByOwner(owner.id);
  }
}

