import { Request, Response } from "express";
import { FinancialSecurityRepositoryInterface } from "../../../application/repositories/FinancialSecurityRepositoryInterface";
import { GetFinancialSecurityListUsecase } from "../../../application/usecases/financial-securiy/GetFinancialSecurityListUsecase";
import { StockOrderRepositoryInterface } from "../../../application/repositories/StockOrderRepositoryInterface";

export class FinancialSecurityController {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface
  ) {}

  public async list(request: Request, response: Response) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetFinancialSecurityListUsecase(
      this.financialSecurityRepository,
      this.stockOrderRepository
    );
    const financialSecurities = await getListUsecase.execute(owner);

    const accountsResponse = financialSecurities.map((financialSecurity) => ({
      id: financialSecurity.id,
      purchasePrice: financialSecurity.purchasePrice,
      ...(financialSecurity.stock
        ? {
            stock: {
              id: financialSecurity.stock.id,
              name: financialSecurity.stock.name,
              basePrice: financialSecurity.stock.basePrice,
              balance: financialSecurity.stock.balance,
              remainingQuantity: financialSecurity.stock.remainingQuantity,
            },
          }
        : {}),
    }));

    response.status(200).json(accountsResponse);
  }
}
