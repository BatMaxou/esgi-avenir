import { StockOrder } from '../../../domain/entities/StockOrder';
import { StockOrderRepositoryInterface } from '../../repositories/StockOrderRepositoryInterface';
import { User } from '../../../domain/entities/User';
import { StockOrderTypeEnum } from '../../../domain/enums/StockOrderTypeEnum';
import { StockOrderStatusEnum } from '../../../domain/enums/StockOrderStatusEnum';
import { InvalidAmountError } from '../../../domain/errors/entities/stock-order/InvalidAmountError';
import { InvalidOwnerError } from '../../../domain/errors/entities/stock-order/InvalidOwnerError';
import { InvalidStockError } from '../../../domain/errors/entities/stock-order/InvalidStockError';
import { InvalidAccountError } from '../../../domain/errors/entities/stock-order/InvalidAccountError';
import { StockRepositoryInterface } from '../../repositories/StockRepositoryInterface';
import { StockNotFoundError } from '../../../domain/errors/entities/stock/StockNotFoundError';
import { DisabledStockError } from '../../../domain/errors/entities/stock/DisabledStockError';
import { FinancialSecurityRepositoryInterface } from '../../repositories/FinancialSecurityRepositoryInterface';
import { FinancialSecurityNotFoundError } from '../../../domain/errors/entities/financial-security/FinancialSecurityNotFoundError';

export class CreateStockOrderUsecase {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
  ) {}

  public async execute(
    amount: number,
    type: StockOrderTypeEnum,
    owner: User,
    stockId: number,
    accountId: number,
  ): Promise<StockOrder | InvalidAccountError | InvalidOwnerError | InvalidAmountError | InvalidStockError | StockNotFoundError | DisabledStockError> {
    const maybeStock = await this.stockRepository.findById(stockId);
    if (maybeStock instanceof StockNotFoundError) {
      return maybeStock;
    }

    if (maybeStock.disabled) {
      return new DisabledStockError('Cannot create order for a disabled stock.');
    }
    
    if (!owner.id) {
      return new InvalidOwnerError('Owner is not valid.');
    }

    const maybeOwnedFinancialSecurity = await this.financialSecurityRepository.findOneByStockAndOwner(stockId, owner.id);
    if (maybeOwnedFinancialSecurity instanceof FinancialSecurityNotFoundError) {
      return maybeOwnedFinancialSecurity;
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
      maybeNewStockOrder instanceof InvalidAccountError
      || maybeNewStockOrder instanceof InvalidOwnerError
      || maybeNewStockOrder instanceof InvalidAmountError
      || maybeNewStockOrder instanceof InvalidStockError
    ) {
      return maybeNewStockOrder;
    }

    return await this.stockOrderRepository.create(maybeNewStockOrder);
  }
}

