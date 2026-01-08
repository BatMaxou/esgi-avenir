import { FinancialSecurityRepositoryInterface } from "../repositories/FinancialSecurityRepositoryInterface";
import { FinancialSecurity } from "../../domain/entities/FinancialSecurity";
import { StockOrderRepositoryInterface } from "../repositories/StockOrderRepositoryInterface";
import { StockOrder } from "../../domain/entities/StockOrder";
import { StockOrderTypeEnum } from "../../domain/enums/StockOrderTypeEnum";
import { StockOrderStatusEnum } from "../../domain/enums/StockOrderStatusEnum";
import { User } from "../../domain/entities/User";

type MockFinancialSecurity = {
  purchasePrice: number;
  ownerId: number;
  stockId: number;
  accountId: number;
};

export class FinancialSecurityFixtures {
  public constructor(
    private readonly repository: FinancialSecurityRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface
  ) {}

  public async load(): Promise<boolean | Error> {
    const financialSecuritys: MockFinancialSecurity[] = [
      this.getBaseStock1(2, 1),
      this.getBaseStock1(2, 1),
      this.getBaseStock1(2, 1),
      this.getBaseStock1(3, 3),
      this.getBaseStock1(3, 3),
      this.getBaseStock2(2, 1),
      this.getBaseStock2(2, 1),
      this.getBaseStock3(4, 5),
      this.getBaseStock3(4, 5),
      this.getBaseStock3(4, 5),
    ];

    for (const financialSecurity of financialSecuritys) {
      await this.createFinancialSecurity(financialSecurity);
    }

    return true;
  }

  private async createFinancialSecurity(
    mockFinancialSecurity: MockFinancialSecurity
  ): Promise<boolean | Error> {
    const maybeFinancialSecurity = FinancialSecurity.from(
      mockFinancialSecurity
    );
    if (maybeFinancialSecurity instanceof Error) {
      return maybeFinancialSecurity;
    }

    const maybeError = await this.repository.create(maybeFinancialSecurity);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    const maybeStockOrder = StockOrder.from({
      amount: mockFinancialSecurity.purchasePrice,
      type: StockOrderTypeEnum.BUY,
      status: StockOrderStatusEnum.COMPLETED,
      purchasePrice: mockFinancialSecurity.purchasePrice,
      owner: User.from({
        id: mockFinancialSecurity.ownerId,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roles: [],
        enabled: true,
      }) as User,
      stockId: mockFinancialSecurity.stockId,
      accountId: mockFinancialSecurity.accountId,
    });

    if (maybeStockOrder instanceof Error) {
      return maybeStockOrder;
    }

    const maybeStockOrderError = await this.stockOrderRepository.create(
      maybeStockOrder
    );
    if (maybeStockOrderError instanceof Error) {
      return maybeStockOrderError;
    }

    return true;
  }

  private getBaseStock1(
    owner: number,
    accountId: number
  ): MockFinancialSecurity {
    return {
      purchasePrice: 200,
      ownerId: owner,
      stockId: 1,
      accountId: accountId,
    };
  }

  private getBaseStock2(
    owner: number,
    accountId: number
  ): MockFinancialSecurity {
    return {
      purchasePrice: 250,
      ownerId: owner,
      stockId: 2,
      accountId: accountId,
    };
  }

  private getBaseStock3(
    owner: number,
    accountId: number
  ): MockFinancialSecurity {
    return {
      purchasePrice: 100,
      ownerId: owner,
      stockId: 3,
      accountId: accountId,
    };
  }
}
