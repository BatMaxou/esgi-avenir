import { FinancialSecurity } from "../../../domain/entities/FinancialSecurity";
import { User } from "../../../domain/entities/User";
import { BalanceStockPriceValue } from "../../../domain/values/BalanceStockPriceValue";
import { RemainingStockQuantityValue } from "../../../domain/values/RemainingStockQuantityValue";
import { FinancialSecurityRepositoryInterface } from "../../repositories/FinancialSecurityRepositoryInterface";
import { StockOrderRepositoryInterface } from "../../repositories/StockOrderRepositoryInterface";

export class GetFinancialSecurityListUsecase {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface
  ) {}

  public async execute(owner: User): Promise<FinancialSecurity[]> {
    if (!owner.id) {
      return [];
    }
    const financialSecurities =
      await this.financialSecurityRepository.findAllByOwner(owner.id);

    return Promise.all(
      financialSecurities.map(async (financialSecurity) => {
        const id = financialSecurity.id;
        if (!id) {
          return {
            ...financialSecurity,
            stock: {
              ...financialSecurity.stock,
              balance: 0,
              remainingQuantity: 0,
            },
          } as FinancialSecurity;
        }

        if (!financialSecurity.stock) {
          return financialSecurity;
        }

        const stockOrders =
          await this.stockOrderRepository.findCompletedByStock(
            financialSecurity.stock.id as number
          );
        const balanceValue = BalanceStockPriceValue.from(
          {
            id: financialSecurity.stock.id,
            basePrice: financialSecurity.stock?.basePrice || 0,
            baseQuantity: financialSecurity.stock?.baseQuantity || 0,
          },
          stockOrders
        );

        const financialSecurities =
          await this.financialSecurityRepository.findAllByStock(
            financialSecurity.stock.id as number
          );
        const remainingQuantity = RemainingStockQuantityValue.from(
          {
            id: financialSecurity.stock.id,
            baseQuantity: financialSecurity.stock?.baseQuantity || 0,
          },
          financialSecurities
        );

        return {
          ...financialSecurity,
          stock: {
            id: financialSecurity.stock.id,
            name: financialSecurity.stock.name,
            basePrice: financialSecurity.stock.basePrice,
            balance: balanceValue.value,
            remainingQuantity: remainingQuantity.value,
          },
        } as FinancialSecurity;
      })
    );
  }
}
