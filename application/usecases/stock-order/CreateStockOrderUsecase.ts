import { StockOrder } from "../../../domain/entities/StockOrder";
import { StockOrderRepositoryInterface } from "../../repositories/StockOrderRepositoryInterface";
import { User } from "../../../domain/entities/User";
import { StockOrderTypeEnum } from "../../../domain/enums/StockOrderTypeEnum";
import { StockOrderStatusEnum } from "../../../domain/enums/StockOrderStatusEnum";
import { InvalidAmountError } from "../../../domain/errors/entities/stock-order/InvalidAmountError";
import { StockRepositoryInterface } from "../../repositories/StockRepositoryInterface";
import { StockNotFoundError } from "../../../domain/errors/entities/stock/StockNotFoundError";
import { DisabledStockError } from "../../../domain/errors/entities/stock/DisabledStockError";
import { FinancialSecurityRepositoryInterface } from "../../repositories/FinancialSecurityRepositoryInterface";
import { FinancialSecurityNotFoundError } from "../../../domain/errors/entities/financial-security/FinancialSecurityNotFoundError";
import { UserNotFoundError } from "../../../domain/errors/entities/user/UserNotFoundError";
import { AccountNotFoundError } from "../../../domain/errors/entities/account/AccountNotFoundError";

export class CreateStockOrderUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface
  ) {}

  public async execute(
    amount: number,
    type: StockOrderTypeEnum,
    owner: User,
    stockId: number,
    accountId: number
  ): Promise<
    | StockOrder
    | InvalidAmountError
    | StockNotFoundError
    | DisabledStockError
    | FinancialSecurityNotFoundError
    | UserNotFoundError
    | AccountNotFoundError
  > {
    const maybeStock = await this.stockRepository.findById(stockId);
    if (maybeStock instanceof StockNotFoundError) {
      return maybeStock;
    }

    if (maybeStock.disabled) {
      return new DisabledStockError(
        "Cannot create order for a disabled stock."
      );
    }

    if (!owner.id) {
      return new UserNotFoundError("Owner is not valid.");
    }

    if (type === StockOrderTypeEnum.SELL) {
      const maybeOwnedFinancialSecurity =
        await this.financialSecurityRepository.findOneByStockAndOwner(
          stockId,
          owner.id
        );
      if (
        maybeOwnedFinancialSecurity instanceof FinancialSecurityNotFoundError
      ) {
        return maybeOwnedFinancialSecurity;
      }
    }

    const maybeNewStockOrder = StockOrder.from({
      amount,
      type,
      status: StockOrderStatusEnum.PENDING,
      owner,
      stockId,
      accountId,
    });
    if (
      maybeNewStockOrder instanceof AccountNotFoundError ||
      maybeNewStockOrder instanceof UserNotFoundError ||
      maybeNewStockOrder instanceof InvalidAmountError ||
      maybeNewStockOrder instanceof StockNotFoundError
    ) {
      return maybeNewStockOrder;
    }

    return await this.stockOrderRepository.create(maybeNewStockOrder);
  }
}
