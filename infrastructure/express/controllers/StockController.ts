import { Request, Response } from "express";

import { StockRepositoryInterface } from "../../../application/repositories/StockRepositoryInterface";
import { CreateStockCommand } from "../../../application/commands/stock/CreateStockCommand";
import { InvalidCreateStockCommandError } from "../../../application/errors/commands/stock/InvalidCreateStockCommandError";
import { InvalidUpdateStockCommandError } from "../../../application/errors/commands/stock/InvalidUpdateStockCommandError";
import { StockNotFoundError } from "../../../domain/errors/entities/stock/StockNotFoundError";
import { UpdateStockCommand } from "../../../application/commands/stock/UpdateStockCommand";
import { UpdateStockParams } from "../../../application/params/stock/UpdateStockParams";
import { InvalidUpdateStockParamsError } from "../../../application/errors/params/stock/InvalidUpdateStockParamsError";
import { CreateStockUsecase } from "../../../application/usecases/stock/CreateStockUsecase";
import { UpdateStockUsecase } from "../../../application/usecases/stock/UpdateStockUsecase";
import { GetStockListQuery } from "../../../application/queries/stock/GetStockListQuery";
import { InvalidGetListStockQueryError } from "../../../application/errors/queries/stock/InvalidGetListStockQueryError";
import { GetStockListUsecase } from "../../../application/usecases/stock/GetStockListUsecase";
import { StockOrderRepositoryInterface } from "../../../application/repositories/StockOrderRepositoryInterface";
import { FinancialSecurityRepositoryInterface } from "../../../application/repositories/FinancialSecurityRepositoryInterface";
import { PurchaseBaseStockParams } from "../../../application/params/stock/PurchaseBaseStockParams";
import { InvalidPurchaseBaseStockParamsError } from "../../../application/errors/params/stock/InvalidPurchaseBaseStockParamsError";
import { PurchaseBaseStockCommand } from "../../../application/commands/stock/PurchaseBaseStockCommand";
import { InvalidPurchaseBaseStockCommandError } from "../../../application/errors/commands/stock/InvalidPurchaseBaseStockCommandError";
import { PurchaseBaseStockUsecase } from "../../../application/usecases/stock/PurchaseBaseStockUsecase";
import { OperationRepositoryInterface } from "../../../application/repositories/OperationRepositoryInterface";
import { SettingRepositoryInterface } from "../../../application/repositories/SettingRepositoryInterface";
import { MailerInterface } from "../../../application/services/email/MailerInterface";
import { SendStockPurchaseSucceedEmailUsecase } from "../../../application/usecases/email/SendStockPurchaseSucceedEmailUsecase";
import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";

export class StockController {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly settingRepository: SettingRepositoryInterface,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreateStockCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateStockCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreateStockUsecase(this.stockRepository);
    const maybeStock = await createUsecase.execute(
      maybeCommand.name,
      maybeCommand.baseQuantity,
      maybeCommand.basePrice
    );

    if (maybeStock instanceof Error) {
      return response.status(400).json({
        error: maybeStock.message,
      });
    }

    response.status(201).json({
      id: maybeStock.id,
      name: maybeStock.name,
      baseQuantity: maybeStock.baseQuantity,
      basePrice: maybeStock.basePrice,
    });
  }

  public async update(request: Request, response: Response) {
    const maybeParams = UpdateStockParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateStockParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateStockCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateStockCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const updateStockUsecase = new UpdateStockUsecase(this.stockRepository);
    const maybeStock = await updateStockUsecase.execute({
      id: maybeParams.id,
      name: maybeCommand.name,
      baseQuantity: maybeCommand.baseQuantity,
    });

    if (maybeStock instanceof StockNotFoundError) {
      return response.status(404).json({
        error: maybeStock.message,
      });
    }

    if (maybeStock instanceof Error) {
      return response.status(400).json({
        error: maybeStock.message,
      });
    }

    response.status(200).json({
      id: maybeStock.id,
      name: maybeStock.name,
      baseQuantity: maybeStock.baseQuantity,
      basePrice: maybeStock.basePrice,
    });
  }

  public async list(request: Request, response: Response) {
    const maybeQuery = GetStockListQuery.from(request.query);
    if (maybeQuery instanceof InvalidGetListStockQueryError) {
      return response.status(400).json({
        error: maybeQuery.message,
      });
    }

    const getListUsecase = new GetStockListUsecase(
      this.stockRepository,
      this.stockOrderRepository,
      this.financialSecurityRepository
    );
    const stocks = await getListUsecase.execute(maybeQuery.term || "");

    response.status(200).json(
      stocks.map((stock) => ({
        id: stock.id,
        name: stock.name,
        baseQuantity: stock.baseQuantity,
        basePrice: stock.basePrice,
        balance: stock.balance,
        remainingQuantity: stock.remainingQuantity,
      }))
    );
  }

  public async purchaseBaseStock(request: Request, response: Response) {
    const maybeParams = PurchaseBaseStockParams.from(request.params);
    if (maybeParams instanceof InvalidPurchaseBaseStockParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = PurchaseBaseStockCommand.from(request.body);
    if (maybeCommand instanceof InvalidPurchaseBaseStockCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const purchaseBaseStockUsecase = new PurchaseBaseStockUsecase(
      this.financialSecurityRepository,
      this.stockRepository,
      this.operationRepository,
      this.settingRepository,
      this.accountRepository,
      this.stockOrderRepository
    );
    const maybeFinancialSecurity = await purchaseBaseStockUsecase.execute(
      owner,
      maybeParams.id,
      maybeCommand.accountId
    );

    if (maybeFinancialSecurity instanceof Error) {
      return response.status(400).json({
        error: maybeFinancialSecurity.message,
      });
    }

    const sendPurchaseEmailUsecase = new SendStockPurchaseSucceedEmailUsecase(
      this.mailer
    );
    await sendPurchaseEmailUsecase.execute(
      owner.email,
      maybeFinancialSecurity.stock?.name || "",
      maybeFinancialSecurity.purchasePrice
    );

    response.status(201).json({
      id: maybeFinancialSecurity.id,
      purchasePrice: maybeFinancialSecurity.purchasePrice,
      ...(maybeFinancialSecurity.stock
        ? {
            stock: {
              id: maybeFinancialSecurity.stock.id,
              name: maybeFinancialSecurity.stock.name,
            },
          }
        : {}),
    });
  }
}
