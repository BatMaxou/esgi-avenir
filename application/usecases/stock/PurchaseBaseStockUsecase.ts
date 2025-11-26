import { User } from '../../../domain/entities/User';
import { OperationRepositoryInterface } from '../../repositories/OperationRepositoryInterface';
import { Operation } from '../../../domain/entities/Operation';
import { OperationEnum } from '../../../domain/enums/OperationEnum';
import { AccountNotFoundError } from '../../../domain/errors/entities/account/AccountNotFoundError';
import { AccountAmountValue } from '../../../domain/values/AccountAmountValue';
import { InsufficientFundsError } from '../../../domain/errors/entities/account/InsufficientFundsError';
import { SettingRepositoryInterface } from '../../repositories/SettingRepositoryInterface';
import { SettingEnum } from '../../../domain/enums/SettingEnum';
import { SettingNotFoundError } from '../../../domain/errors/entities/setting/SettingNotFoundError';
import { InvalidSettingValueError } from '../../../domain/errors/entities/setting/InvalidSettingValueError';
import { FinancialSecurityRepositoryInterface } from '../../repositories/FinancialSecurityRepositoryInterface';
import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { FinancialSecurity } from '../../../domain/entities/FinancialSecurity';
import { StockNotFoundError } from '../../../domain/errors/entities/stock/StockNotFoundError';
import { DisabledStockError } from '../../../domain/errors/entities/stock/DisabledStockError';
import { InsufficientBaseQuantityError } from '../../../domain/errors/entities/stock/InsufficientBaseQuantityError';
import { Stock } from '../../../domain/entities/Stock';
import { InvalidPurchasePriceError } from '../../../domain/errors/entities/financial-security/InvalidPurchasePriceError';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { AccountRepositoryInterface } from '../../repositories/AccountRepositoryInterface';
import { AccountNotEmptyError } from '../../../domain/errors/entities/operation/AccountNotEmptyError';
import { InvalidOperationTypeError } from '../../../domain/errors/entities/operation/InvalidOperationTypeError';

type Transaction = {
  fromId: number;
  amount: number;
}

export class PurchaseBaseStockUsecase {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly stockReopository: StockRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly settingRepository: SettingRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
  ) {}

  public async execute(
    user: User,
    stockId: number,
    accountId: number,
  ): Promise<FinancialSecurity | AccountNotFoundError | StockNotFoundError | DisabledStockError | InsufficientBaseQuantityError | SettingNotFoundError | InvalidSettingValueError | InsufficientFundsError | AccountNotEmptyError | InvalidOperationTypeError | UserNotFoundError | InvalidPurchasePriceError> {
    // -----------
    // Check Account ownership
    const maybeAccount = await this.accountRepository.findById(accountId);
    if (maybeAccount instanceof AccountNotFoundError) {
      return maybeAccount;
    }

    if (maybeAccount.ownerId !== user.id) {
      return new AccountNotFoundError('Account not found.');
    }

    // -----------
    // Check stock availability
    const maybeStock = await this.checkStockAvailability(stockId);
    if (
      maybeStock instanceof StockNotFoundError
      || maybeStock instanceof DisabledStockError
      || maybeStock instanceof InsufficientBaseQuantityError
    ) {
      return maybeStock;
    }

    // -----------
    // Retrieve fees amounts
    const maybePurchaseFee = await this.getPurchaseFee();
    if (
      maybePurchaseFee instanceof SettingNotFoundError
      || maybePurchaseFee instanceof InvalidSettingValueError
    ) {
      return maybePurchaseFee;
    }

    // -----------
    // Build transaction
    const maybeTransaction = this.getTransaction(accountId, maybeStock);

    // -----------
    // Check funds availability
    const maybeFundsAvailability = await this.checkFundsAvailability(
      maybeTransaction,
      maybePurchaseFee,
    );
    if (
      maybeFundsAvailability instanceof AccountNotFoundError
      || maybeFundsAvailability instanceof InsufficientFundsError
    ) {
      return maybeFundsAvailability;
    }

    // -----------
    // Generate operations
    const maybeToBankOperation = this.getToBankOperation(maybeTransaction);
    if (
      maybeToBankOperation instanceof AccountNotFoundError
      || maybeToBankOperation instanceof AccountNotEmptyError
      || maybeToBankOperation instanceof InvalidOperationTypeError
    ) {
      return maybeToBankOperation;
    }

    const maybePurchaseFeeOperation = this.getFeeOperation(maybeTransaction.fromId, maybePurchaseFee);
    if (
      maybePurchaseFeeOperation instanceof AccountNotFoundError
      || maybePurchaseFeeOperation instanceof AccountNotEmptyError
      || maybePurchaseFeeOperation instanceof InvalidOperationTypeError
    ) {
      return maybePurchaseFeeOperation;
    }

    // -----------
    // Generate financial security
    const maybeFinancialSecurity = FinancialSecurity.from({
      ownerId: user.id,
      stockId: maybeStock.id,
      purchasePrice: maybeTransaction.amount,
    });
    if (
      maybeFinancialSecurity instanceof UserNotFoundError
      || maybeFinancialSecurity instanceof StockNotFoundError
      || maybeFinancialSecurity instanceof InvalidPurchasePriceError
    ) {
      return maybeFinancialSecurity;
    }

    // -----------
    // Create operations
    const [maybeCreatedToBankOperation, maybeCreatedPurchaseFeeOperation] = await Promise.all([
      this.operationRepository.create(maybeToBankOperation),
      this.operationRepository.create(maybePurchaseFeeOperation),
    ]);

    if (maybeCreatedToBankOperation instanceof AccountNotFoundError) {
      return maybeCreatedToBankOperation;
    }

    if (maybeCreatedPurchaseFeeOperation instanceof AccountNotFoundError) {
      return maybeCreatedPurchaseFeeOperation;
    }

    // -----------
    // Create financial security 
    const maybeCreatedFinancialSecurity = await this.financialSecurityRepository.create(maybeFinancialSecurity);
    if (
      maybeCreatedFinancialSecurity instanceof StockNotFoundError
      || maybeCreatedFinancialSecurity instanceof UserNotFoundError
    ) {
      return maybeCreatedFinancialSecurity;
    }

    return maybeCreatedFinancialSecurity;
  }

  private async checkStockAvailability(
    stockId: number,
  ): Promise<Stock | StockNotFoundError | DisabledStockError | InsufficientBaseQuantityError> {
    const maybeStock = await this.stockReopository.findById(stockId);
    if (maybeStock instanceof StockNotFoundError) {
      return maybeStock;
    }

    if (maybeStock.disabled) {
      return new DisabledStockError('The stock is disabled and cannot be purchased.');
    }

    const existingBaseStocks = await this.financialSecurityRepository.findAllByStock(stockId);
    if (existingBaseStocks.length >= maybeStock.baseQuantity) {
      return new InsufficientBaseQuantityError('No more base stocks available for this stock.');
    }

    return maybeStock;
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

  private getTransaction(accountId: number, stock: Stock): Transaction {
    return {
      fromId: accountId,
      amount: stock.basePrice,
    };
  }

  private getToBankOperation(transaction: Transaction): Operation | AccountNotFoundError | AccountNotEmptyError | InvalidOperationTypeError  {
    return Operation.from({
      type: OperationEnum.TO_BANK,
      name: OperationEnum.TO_BANK,
      ...transaction,
    })
  }

  private getFeeOperation(accountId: number, amount: number): Operation | AccountNotFoundError | AccountNotEmptyError | InvalidOperationTypeError {
    return Operation.from({
      type: OperationEnum.FEE,
      name: OperationEnum.FEE,
      fromId: accountId,
      amount,
    });
  }
}

