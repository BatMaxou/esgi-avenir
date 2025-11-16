import { AccountRepositoryInterface } from '../repositories/AccountRepositoryInterface';
import { Account } from '../../domain/entities/Account';
import { IbanValue } from '../../domain/values/IbanValue';

type MockAccount = {
  iban: string,
  name: string,
  ownerId: number,
  isSavings?: boolean,
}

export class AccountFixtures {
  public constructor(
    private readonly repository: AccountRepositoryInterface,
    private readonly bankCode: string,
    private readonly branchCode: string,
  ) {}

  public async load(): Promise<boolean | Error> {
    const ibans: Record<number, string> = {
      1: this.createIban('0000001'),
      2: this.createIban('0000002'),
      3: this.createIban('0000003'),
    };

    const accounts: MockAccount[] = [
      {
        iban: ibans[1],
        name: 'User Account',
        ownerId: 1,
      },
      {
        iban: ibans[2],
        name: 'Second User Account',
        ownerId: 1,
      },
      {
        iban: ibans[3],
        name: 'User Savings Account',
        ownerId: 1,
        isSavings: true,
      },
    ];

    await Promise.all(accounts.map((account) => this.createAccount(account)));

    return true;
  }

  private async createAccount(mockAccount: MockAccount): Promise<boolean | Error> {
    const maybeAccount = Account.from(mockAccount);
    if (maybeAccount instanceof Error) {
      return maybeAccount;
    }

    const maybeError = await this.repository.create(maybeAccount);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }

  private createIban(
    id: string,
  ): string {
    const maybeIban = IbanValue.create(this.bankCode, this.branchCode, id);
    if (maybeIban instanceof Error) {
      throw maybeIban;
    }

    return maybeIban.value;
  }
}
