import { User } from '../../../domain/entities/User';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';
import { StockOrder } from '../../../domain/entities/StockOrder';
import { StockOrderNotFoundError } from '../../../domain/errors/entities/stock-order/StockOrderNotFoundError';
import { StockOrderStatusEnum } from '../../../domain/enums/StockOrderStatusEnum';
import { InvalidStatusError } from '../../../domain/errors/entities/stock-order/InvalidStatusError';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { Operation } from '../../../domain/entities/Operation';
import { OperationEnum } from '../../../domain/enums/OperationEnum';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { InvalidTypeError } from '../../../domain/errors/entities/stock-order/InvalidTypeError';
import { StockOrderTypeEnum } from '../../../domain/enums/StockOrderTypeEnum';
import { InvalidAccountError } from '../../../domain/errors/entities/operation/InvalidAccountError';
import { AccountAmountValue } from '../../../domain/values/AccountAmountValue';
import { InsufficientFundsError } from '../../../domain/errors/entities/account/InsufficientFundsError';
import { SettingRepositoryInterface } from '../../repositories/SettingRepositoryInterface';
import { SettingEnum } from '../../../domain/enums/SettingEnum';
import { SettingNotFoundError } from '../../../domain/errors/entities/setting/SettingNotFoundError';
import { InvalidSettingValueError } from '../../../domain/errors/entities/setting/InvalidSettingValueError';
import { FinancialSecurityRepositoryInterface } from '../../repositories/FinancialSecurityRepositoryInterface';
import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { FinancialSecurity } from '../../../domain/entities/FinancialSecurity';

type Transaction = {
  fromId: number;
  amount: number;
}

export class PurchaseFinancialSecurityUsecase {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly stockReopository: StockRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly settingRepository: SettingRepositoryInterface,
  ) {}

  public async execute(
    user: User,
    stockId: number,
    accountId: number,
  ): Promise<FinancialSecurity> {
    // -----------
    // Check stock quantity
    // -----------
    // Retrieve fees amounts
    // -----------
    // Check funds availability
    // -----------
    // Generate operations
    // -----------
    // Generate financial security
    // -----------
    // Create operations
    // -----------
    // Create financial security 

    return true;
  }

  private async getPurchaseFee(): Promise<number | SettingNotFoundError | InvalidSettingValueError> {
    const maybePurchaseFeeAmount = await this.settingRepository.findByCode(SettingEnum.STOCK_ORDER_PURCHASE_FEE);
    if (maybePurchaseFeeAmount instanceof SettingNotFoundError) {
      return maybePurchaseFeeAmount;
    }

    const amount = typeof maybePurchaseFeeAmount.value === 'string' ? parseInt(maybePurchaseFeeAmount.value, 10) : maybePurchaseFeeAmount.value;
    if (typeof amount !== 'number') {
      return new InvalidSettingValueError('Purchase fee setting value is not a number.');
    }

    return amount;
  }

  private async checkFundsAvailability(
    transaction: Transaction,
    purchaseFeeAmount: number,
  ): Promise<true | AccountNotFoundError | InsufficientFundsError> {
    const maybeFromAccountOperations = await this.operationRepository.findByAccount(transaction.fromId);
    if (maybeFromAccountOperations instanceof AccountNotFoundError) {
      return maybeFromAccountOperations 
    }

    const currentAmount = AccountAmountValue.from(transaction.fromId, maybeFromAccountOperations);
    if (currentAmount.value < (transaction.amount + purchaseFeeAmount)) {
      return new InsufficientFundsError('Insufficient funds for buyer account.');
    }

    return true;
  }

  private getToBankOperation(transaction: Transaction): Operation | InvalidAccountError {
    return Operation.from({
      type: OperationEnum.TO_BANK,
      ...transaction,
    })
  }
}

