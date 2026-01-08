import { User } from "../../../domain/entities/User";
import { StockOrderRepositoryInterface } from "../../repositories/StockOrderRepositoryInterface";
import { StockOrder } from "../../../domain/entities/StockOrder";
import { StockOrderNotFoundError } from "../../../domain/errors/entities/stock-order/StockOrderNotFoundError";
import { StockOrderStatusEnum } from "../../../domain/enums/StockOrderStatusEnum";
import { InvalidStatusError } from "../../../domain/errors/entities/stock-order/InvalidStatusError";
import { OperationRepositoryInterface } from "../../repositories/OperationRepositoryInterface";
import { Operation } from "../../../domain/entities/Operation";
import { OperationEnum } from "../../../domain/enums/OperationEnum";
import { AccountNotFoundError } from "../../../domain/errors/entities/account/AccountNotFoundError";
import { InvalidTypeError } from "../../../domain/errors/entities/stock-order/InvalidTypeError";
import { StockOrderTypeEnum } from "../../../domain/enums/StockOrderTypeEnum";
import { AccountAmountValue } from "../../../domain/values/AccountAmountValue";
import { InsufficientFundsError } from "../../../domain/errors/entities/account/InsufficientFundsError";
import { SettingRepositoryInterface } from "../../repositories/SettingRepositoryInterface";
import { SettingEnum } from "../../../domain/enums/SettingEnum";
import { SettingNotFoundError } from "../../../domain/errors/entities/setting/SettingNotFoundError";
import { InvalidSettingValueError } from "../../../domain/errors/entities/setting/InvalidSettingValueError";
import { FinancialSecurityRepositoryInterface } from "../../repositories/FinancialSecurityRepositoryInterface";
import { FinancialSecurity } from "../../../domain/entities/FinancialSecurity";
import { FinancialSecurityNotFoundError } from "../../../domain/errors/entities/financial-security/FinancialSecurityNotFoundError";
import { InvalidPurchasePriceError } from "../../../domain/errors/entities/financial-security/InvalidPurchasePriceError";
import { StockNotFoundError } from "../../../domain/errors/entities/stock/StockNotFoundError";
import { AccountNotEmptyError } from "../../../domain/errors/entities/operation/AccountNotEmptyError";
import { InvalidOperationTypeError } from "../../../domain/errors/entities/operation/InvalidOperationTypeError";
import { UserNotFoundError } from "../../../domain/errors/entities/user/UserNotFoundError";

type Transaction = {
  fromId: number;
  toId: number;
  amount: number;
};

export class AcceptStockOrderUsecase {
  public constructor(
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly settingRepository: SettingRepositoryInterface,
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface
  ) {}

  public async execute(
    owner: User,
    fromStockOrderId: number,
    toStockOrderId: number
  ): Promise<
    | FinancialSecurity
    | StockOrderNotFoundError
    | InvalidStatusError
    | StockNotFoundError
    | FinancialSecurityNotFoundError
    | SettingNotFoundError
    | InvalidSettingValueError
    | InvalidTypeError
    | AccountNotFoundError
    | InsufficientFundsError
    | AccountNotEmptyError
    | InvalidOperationTypeError
    | UserNotFoundError
    | InvalidPurchasePriceError
  > {
    // -----------
    // Check existence and ownership of stock orders
    const maybeFromStockOrder = await this.stockOrderRepository.findById(
      fromStockOrderId
    );
    if (maybeFromStockOrder instanceof StockOrderNotFoundError) {
      return maybeFromStockOrder;
    }

    if (maybeFromStockOrder.ownerId !== owner.id) {
      return new StockOrderNotFoundError("StockOrder not found.");
    }

    const maybeToStockOrder = await this.stockOrderRepository.findById(
      toStockOrderId
    );
    if (maybeToStockOrder instanceof StockOrderNotFoundError) {
      return maybeToStockOrder;
    }

    // -----------
    // Check stock match
    if (maybeFromStockOrder.stockId !== maybeToStockOrder.stockId) {
      return new StockNotFoundError("Stock orders must be for the same stock.");
    }

    // -----------
    // Check statuses
    if (
      [maybeFromStockOrder.status, maybeToStockOrder.status].some(
        (status) => status !== StockOrderStatusEnum.PENDING
      )
    ) {
      return new InvalidStatusError(
        "Only pending stock orders can be accepted."
      );
    }

    // -----------
    // Check types
    if (maybeFromStockOrder.type === maybeToStockOrder.type) {
      return new InvalidTypeError(
        "Stock orders must be of different types (one BUY, one SELL)."
      );
    }

    // -----------
    // Check financial security existence
    // The seller must own the stock, determine who is the seller
    let sellerStockOrder: StockOrder;

    if (maybeFromStockOrder.type === StockOrderTypeEnum.SELL) {
      sellerStockOrder = maybeFromStockOrder;
    } else {
      sellerStockOrder = maybeToStockOrder;
    }

    if (!sellerStockOrder.ownerId) {
      return new UserNotFoundError("Seller owner not found.");
    }

    const maybeFinancialSecurity =
      await this.financialSecurityRepository.findOneByStockAndOwner(
        sellerStockOrder.stockId,
        sellerStockOrder.ownerId
      );
    if (
      maybeFinancialSecurity instanceof FinancialSecurityNotFoundError ||
      !maybeFinancialSecurity.id
    ) {
      return new FinancialSecurityNotFoundError(
        "Financial security not found for the given stock and seller owner."
      );
    }

    // -----------
    // Retrieve fees amounts
    const [maybePurchaseFee, maybeSaleFee] = await Promise.all([
      this.getPurchaseFee(),
      this.getSaleFee(),
    ]);

    if (
      maybePurchaseFee instanceof SettingNotFoundError ||
      maybePurchaseFee instanceof InvalidSettingValueError
    ) {
      return maybePurchaseFee;
    }

    if (
      maybeSaleFee instanceof SettingNotFoundError ||
      maybeSaleFee instanceof InvalidSettingValueError
    ) {
      return maybeSaleFee;
    }

    // -----------
    // Try to build transaction
    const maybeTransaction = this.getTransaction(
      maybeFromStockOrder,
      maybeToStockOrder
    );
    if (maybeTransaction instanceof InvalidTypeError) {
      return maybeTransaction;
    }

    // -----------
    // Check funds availability
    const maybeFundsAvailability = await this.checkFundsAvailability(
      maybeTransaction,
      maybePurchaseFee,
      maybeSaleFee
    );
    if (
      maybeFundsAvailability instanceof AccountNotFoundError ||
      maybeFundsAvailability instanceof InsufficientFundsError
    ) {
      return maybeFundsAvailability;
    }

    // -----------
    // Generate operations
    const maybeTransferOperation = this.getTransferOperation(maybeTransaction);
    if (
      maybeTransferOperation instanceof AccountNotFoundError ||
      maybeTransferOperation instanceof AccountNotEmptyError ||
      maybeTransferOperation instanceof InvalidOperationTypeError
    ) {
      return maybeTransferOperation;
    }

    const maybePurchaseFeeOperation = this.getFeeOperation(
      maybeTransaction.fromId,
      maybePurchaseFee
    );
    if (
      maybePurchaseFeeOperation instanceof AccountNotFoundError ||
      maybePurchaseFeeOperation instanceof AccountNotEmptyError ||
      maybePurchaseFeeOperation instanceof InvalidOperationTypeError
    ) {
      return maybePurchaseFeeOperation;
    }

    const maybeSaleFeeOperation = this.getFeeOperation(
      maybeTransaction.toId,
      maybeSaleFee
    );
    if (
      maybeSaleFeeOperation instanceof AccountNotFoundError ||
      maybeSaleFeeOperation instanceof AccountNotEmptyError ||
      maybeSaleFeeOperation instanceof InvalidOperationTypeError
    ) {
      return maybeSaleFeeOperation;
    }

    // -----------
    // Generate financial security to create
    // The buyer receives the stock, determine who is the buyer
    const buyerStockOrder =
      maybeFromStockOrder.type === StockOrderTypeEnum.BUY
        ? maybeFromStockOrder
        : maybeToStockOrder;

    const maybeNewFinancialSecurity = FinancialSecurity.from({
      ownerId: buyerStockOrder.ownerId,
      stockId: buyerStockOrder.stockId,
      purchasePrice: maybeTransaction.amount,
    });
    if (
      maybeNewFinancialSecurity instanceof StockNotFoundError ||
      maybeNewFinancialSecurity instanceof UserNotFoundError ||
      maybeNewFinancialSecurity instanceof InvalidPurchasePriceError
    ) {
      return maybeNewFinancialSecurity;
    }

    // -----------
    // Update stock orders statuses
    const [maybeUpdatedFromStockOrder, maybeUpdatedToStockOrder] =
      await Promise.all([
        await this.stockOrderRepository.update({
          id: maybeFromStockOrder.id!,
          status: StockOrderStatusEnum.COMPLETED,
          purchasePrice: maybeTransaction.amount,
        }),
        await this.stockOrderRepository.update({
          id: maybeToStockOrder.id!,
          status: StockOrderStatusEnum.COMPLETED,
          purchasePrice: maybeTransaction.amount,
        }),
      ]);

    if (maybeUpdatedFromStockOrder instanceof StockOrderNotFoundError) {
      return maybeUpdatedFromStockOrder;
    }

    if (maybeUpdatedToStockOrder instanceof StockOrderNotFoundError) {
      return maybeUpdatedToStockOrder;
    }

    // -----------
    // Create operations
    const [
      maybeCreatedTransferOperation,
      maybeCreatedPurchaseFeeOperation,
      maybeCreatedSaleFeeOperation,
    ] = await Promise.all([
      this.operationRepository.create(maybeTransferOperation),
      this.operationRepository.create(maybePurchaseFeeOperation),
      this.operationRepository.create(maybeSaleFeeOperation),
    ]);

    if (maybeCreatedTransferOperation instanceof AccountNotFoundError) {
      return maybeCreatedTransferOperation;
    }

    if (maybeCreatedPurchaseFeeOperation instanceof AccountNotFoundError) {
      return maybeCreatedPurchaseFeeOperation;
    }

    if (maybeCreatedSaleFeeOperation instanceof AccountNotFoundError) {
      return maybeCreatedSaleFeeOperation;
    }

    // -----------
    // Delete financial security
    const maybeSuccess = await this.financialSecurityRepository.delete(
      maybeFinancialSecurity.id
    );
    if (
      maybeSuccess instanceof FinancialSecurityNotFoundError ||
      !maybeSuccess
    ) {
      return new FinancialSecurityNotFoundError(
        "Financial security to delete not found."
      );
    }

    // -----------
    // Create financial security
    const maybeCreatedFinancialSecurity =
      await this.financialSecurityRepository.create(maybeNewFinancialSecurity);
    if (
      maybeCreatedFinancialSecurity instanceof UserNotFoundError ||
      maybeCreatedFinancialSecurity instanceof StockNotFoundError
    ) {
      return maybeCreatedFinancialSecurity;
    }

    return maybeCreatedFinancialSecurity;
  }

  private async getPurchaseFee(): Promise<
    number | SettingNotFoundError | InvalidSettingValueError
  > {
    const maybePurchaseFeeAmount = await this.settingRepository.findByCode(
      SettingEnum.STOCK_ORDER_PURCHASE_FEE
    );
    if (maybePurchaseFeeAmount instanceof SettingNotFoundError) {
      return maybePurchaseFeeAmount;
    }

    const amount =
      typeof maybePurchaseFeeAmount.value === "string"
        ? parseInt(maybePurchaseFeeAmount.value, 10)
        : maybePurchaseFeeAmount.value;
    if (typeof amount !== "number") {
      return new InvalidSettingValueError(
        "Purchase fee setting value is not a number."
      );
    }

    return amount;
  }

  private async getSaleFee(): Promise<
    number | SettingNotFoundError | InvalidSettingValueError
  > {
    const maybeSaleFeeAmount = await this.settingRepository.findByCode(
      SettingEnum.STOCK_ORDER_SALE_FEE
    );
    if (maybeSaleFeeAmount instanceof SettingNotFoundError) {
      return maybeSaleFeeAmount;
    }

    const amount =
      typeof maybeSaleFeeAmount.value === "string"
        ? parseInt(maybeSaleFeeAmount.value, 10)
        : maybeSaleFeeAmount.value;
    if (typeof amount !== "number") {
      return new InvalidSettingValueError(
        "Sale fee setting value is not a number."
      );
    }

    return amount;
  }

  private getTransaction(
    from: StockOrder,
    to: StockOrder
  ): Transaction | InvalidTypeError {
    switch (from.type) {
      case StockOrderTypeEnum.BUY:
        return {
          fromId: from.accountId,
          toId: to.accountId,
          amount: to.amount,
        };
      case StockOrderTypeEnum.SELL:
        return {
          fromId: to.accountId,
          toId: from.accountId,
          amount: to.amount,
        };
      default:
        return new InvalidTypeError("Stock order type is not valid.");
    }
  }

  private async checkFundsAvailability(
    transaction: Transaction,
    purchaseFeeAmount: number,
    saleFeeAmount: number
  ): Promise<true | AccountNotFoundError | InsufficientFundsError> {
    const maybeFromAccountOperations =
      await this.operationRepository.findByAccount(transaction.fromId);
    if (maybeFromAccountOperations instanceof AccountNotFoundError) {
      return maybeFromAccountOperations;
    }

    const currentAmount = AccountAmountValue.from(
      transaction.fromId,
      maybeFromAccountOperations
    );
    if (currentAmount.value < transaction.amount + purchaseFeeAmount) {
      return new InsufficientFundsError(
        "Insufficient funds for buyer account."
      );
    }

    const maybeToAccountOperations =
      await this.operationRepository.findByAccount(transaction.toId);
    if (maybeToAccountOperations instanceof AccountNotFoundError) {
      return maybeToAccountOperations;
    }

    const currentToAmount = AccountAmountValue.from(
      transaction.toId,
      maybeToAccountOperations
    );
    if (
      currentToAmount.value < saleFeeAmount &&
      transaction.amount < saleFeeAmount
    ) {
      return new InsufficientFundsError(
        "Insufficient funds for seller account."
      );
    }

    return true;
  }

  private getTransferOperation(
    transaction: Transaction
  ):
    | Operation
    | AccountNotFoundError
    | AccountNotEmptyError
    | InvalidOperationTypeError {
    return Operation.from({
      type: OperationEnum.TRANSFER,
      name: OperationEnum.TRANSFER,
      ...transaction,
    });
  }

  private getFeeOperation(
    accountId: number,
    amount: number
  ):
    | Operation
    | AccountNotFoundError
    | AccountNotEmptyError
    | InvalidOperationTypeError {
    return Operation.from({
      type: OperationEnum.FEE,
      name: OperationEnum.FEE,
      fromId: accountId,
      amount,
    });
  }
}
