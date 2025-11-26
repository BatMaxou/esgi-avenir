import { User } from "./User";
import { Account } from "./Account";
import { UserNotFoundError } from "../errors/entities/user/UserNotFoundError";
import { AccountNotFoundError } from "../errors/entities/account/AccountNotFoundError";
import { InvalidAmountError } from "../errors/entities/bank-credit/InvalidAmountError";
import { InvalidInterestPercentageError } from "../errors/entities/bank-credit/InvalidInterestPercentageError";
import { InvalidInsurancePercentageError } from "../errors/entities/bank-credit/InvalidInsurancePercentageError";
import { InvalidDurationInMonthsError } from "../errors/entities/bank-credit/InvalidDurationInMonthsError";
import { BankCreditStatusEnum } from "../enums/BankCreditStatusEnum";

export interface HydratedBankCredit extends BankCredit {
  remains: number;
}

export class BankCredit {
  public id?: number;

  public static from({
    id,
    amount,
    insurancePercentage,
    interestPercentage,
    durationInMonths,
    status,
    accountId,
    account,
    advisorId,
    advisor,
    ownerId,
    owner,
  }: {
    id?: number,
    amount: number,
    insurancePercentage: number,
    interestPercentage: number,
    durationInMonths: number,
    status: BankCreditStatusEnum,
    accountId?: number,
    account?: Account,
    advisorId?: number,
    advisor?: User,
    ownerId?: number,
    owner?: User,
  }): BankCredit | UserNotFoundError | AccountNotFoundError | InvalidAmountError | InvalidInterestPercentageError | InvalidInsurancePercentageError | InvalidDurationInMonthsError {
    const maybeAccountId = accountId ?? account?.id;
    if (!maybeAccountId) {
      return new AccountNotFoundError('Account not found for bank credit.');
    }

    const maybeAdvisorId = advisorId ?? advisor?.id;
    if (!maybeAdvisorId) {
      return new UserNotFoundError('Advisor not found for bank credit.');
    }

    const maybeOwnerId = ownerId ?? owner?.id;
    if (!maybeOwnerId) {
      return new UserNotFoundError('Owner not found for bank credit.');
    }

    if (amount <= 0) {
      return new InvalidAmountError('Amount must be greater than zero for bank credit.');
    }

    if (interestPercentage < 0 || interestPercentage > 100) {
      return new InvalidInterestPercentageError('Interest percentage must be between 0 and 100 for bank credit.');
    }

    if (insurancePercentage < 0 || insurancePercentage > 100) {
      return new InvalidInsurancePercentageError('Insurance percentage must be between 0 and 100 for bank credit.');
    }

    if (durationInMonths <= 0) {
      return new InvalidDurationInMonthsError('Duration in months must be greater than zero for bank credit.');
    }

    const bankCredit = new this(
      amount,
      insurancePercentage,
      interestPercentage,
      durationInMonths,
      status,
      maybeAccountId,
      maybeAdvisorId,
      maybeOwnerId,
      account ?? undefined,
      advisor ?? undefined,
      owner ?? undefined,
    );

    if (id) {
      bankCredit.id = id;
    }

    return bankCredit;
  }

  private constructor(
    public amount: number,
    public insurancePercentage: number,
    public interestPercentage: number,
    public durationInMonths: number,
    public status: BankCreditStatusEnum,
    public accountId: number,
    public advisorId: number,
    public ownerId: number,
    public account?: Account,
    public advisor?: User,
    public owner?: User,
  ) {
  }
}
