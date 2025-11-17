import { FinancialSecurityRepositoryInterface } from '../repositories/FinancialSecurityRepositoryInterface';
import { FinancialSecurity } from '../../domain/entities/FinancialSecurity';

type MockFinancialSecurity = {
  purchasePrice: number,
  ownerId: number,
  stockId: number,
}

export class FinancialSecurityFixtures {
  public constructor(
    private readonly repository: FinancialSecurityRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const financialSecuritys: MockFinancialSecurity[] = [
      this.getBaseStock1(2),
      this.getBaseStock1(2),
      this.getBaseStock1(2),
      this.getBaseStock1(3),
      this.getBaseStock1(3),
      this.getBaseStock2(2),
      this.getBaseStock2(2),
      this.getBaseStock3(4),
      this.getBaseStock3(4),
      this.getBaseStock3(4),
    ];

    for (const financialSecurity of financialSecuritys) {
      await this.createFinancialSecurity(financialSecurity);
    }

    return true;
  }

  private async createFinancialSecurity(mockFinancialSecurity: MockFinancialSecurity): Promise<boolean | Error> {
    const maybeFinancialSecurity = FinancialSecurity.from(mockFinancialSecurity);
    if (maybeFinancialSecurity instanceof Error) {
      return maybeFinancialSecurity;
    }

    const maybeError = await this.repository.create(maybeFinancialSecurity);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }

  private getBaseStock1(owner: number): MockFinancialSecurity {
    return {
      purchasePrice: 200,
      ownerId: owner,
      stockId: 1,
    };
  }

  private getBaseStock2(owner: number): MockFinancialSecurity {
    return {
      purchasePrice: 250,
      ownerId: owner,
      stockId: 2,
    };
  }

  private getBaseStock3(owner: number): MockFinancialSecurity {
    return {
      purchasePrice: 100,
      ownerId: owner,
      stockId: 3,
    };
  }
}
