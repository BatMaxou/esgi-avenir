import { Request, Response } from "express";
import { FinancialSecurityRepositoryInterface } from "../../../application/repositories/FinancialSecurityRepositoryInterface";
import { GetFinancialSecurityListUsecase } from "../../../application/usecases/financial-securiy/GetFinancialSecurityListUsecase";

export class FinancialSecurityController {
  public constructor(
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
  ) {}

  public async list(request: Request, response: Response) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: 'Unauthorized',
      });
    }
    
    const getListUsecase = new GetFinancialSecurityListUsecase(this.financialSecurityRepository)
    const financialSecurities = await getListUsecase.execute(owner);

    const accountsResponse = financialSecurities.map((financialSecurity) => ({
      id: financialSecurity.id,
      purchasePrice: financialSecurity.purchasePrice,
      ...(financialSecurity.stock ? {
        stock: {
          id: financialSecurity.stock.id,
          name: financialSecurity.stock.name,
        }
      } : {})
    }));

    response.status(200).json(accountsResponse);
  }
}
