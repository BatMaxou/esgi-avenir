import { FastifyReply, FastifyRequest } from "fastify";

import { FinancialSecurityRepositoryInterface } from "../../../../application/repositories/FinancialSecurityRepositoryInterface";
import { StockOrderRepositoryInterface } from "../../../../application/repositories/StockOrderRepositoryInterface";
import { GetFinancialSecurityListUsecase } from "../../../../application/usecases/financial-securiy/GetFinancialSecurityListUsecase";

export class FinancialSecurityController {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface
  ) {}

  public async list(request: FastifyRequest, response: FastifyReply) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
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

    response.status(200).send(accountsResponse);
  }
}
