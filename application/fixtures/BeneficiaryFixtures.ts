import { BeneficiaryRepositoryInterface } from '../repositories/BeneficiaryRepositoryInterface';
import { Beneficiary } from '../../domain/entities/Beneficiary';

type MockBeneficiary = {
  name: string,
  ownerId: number,
  accountId: number,
}

export class BeneficiaryFixtures {
  public constructor(
    private readonly repository: BeneficiaryRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const beneficiarys: MockBeneficiary[] = [
      {
        name: 'My first account',
        ownerId: 2,
        accountId: 1,
      },
      {
        name: 'My second account',
        ownerId: 2,
        accountId: 2,
      },
      {
        name: 'My savings account',
        ownerId: 2,
        accountId: 3,
      },
      {
        name: 'My first account',
        ownerId: 3,
        accountId: 4,
      },
      {
        name: 'My savings account',
        ownerId: 3,
        accountId: 5,
      },
      {
        name: 'My first account',
        ownerId: 4,
        accountId: 6,
      },
      {
        name: 'My second account',
        ownerId: 4,
        accountId: 7,
      },
      {
        name: 'My savings account',
        ownerId: 4,
        accountId: 8,
      },
    ];

    for (const beneficiary of beneficiarys) {
      await this.createBeneficiary(beneficiary);
    }

    return true;
  }

  private async createBeneficiary(mockBeneficiary: MockBeneficiary): Promise<boolean | Error> {
    const maybeBeneficiary = Beneficiary.from(mockBeneficiary);
    if (maybeBeneficiary instanceof Error) {
      return maybeBeneficiary;
    }

    const maybeError = await this.repository.create(maybeBeneficiary);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
