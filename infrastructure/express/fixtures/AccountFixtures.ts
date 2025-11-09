import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";
import { Account } from "../../../domain/entities/Account";

type MockAccount = {
  iban: string,
  name: string,
  ownerId: number,
}

export class AccountFixtures {
  public constructor(
    private repository: AccountRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const accounts: MockAccount[] = [
      {
        iban: 'FR7612345678901234567890123',
        name: 'User Account',
        ownerId: 1,
      },
      {
        iban: 'FR7612345678901234567890124',
        name: 'Second User Account',
        ownerId: 1,
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
}
