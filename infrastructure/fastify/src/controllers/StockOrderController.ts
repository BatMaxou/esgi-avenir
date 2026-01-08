import { FastifyRequest, FastifyReply } from "fastify";

import { MailerInterface } from "../../../../application/services/email/MailerInterface";
import { StockOrderRepositoryInterface } from "../../../../application/repositories/StockOrderRepositoryInterface";
import { OperationRepositoryInterface } from "../../../../application/repositories/OperationRepositoryInterface";
import { CreateStockOrderUsecase } from "../../../../application/usecases/stock-order/CreateStockOrderUsecase";
import { CreateStockOrderCommand } from "../../../../application/commands/stock-order/CreateStockOrderCommand";
import { InvalidCreateStockOrderCommandError } from "../../../../application/errors/commands/stock-order/InvalidCreateStockOrderCommandError";
import { GetStockOrderListUsecase } from "../../../../application/usecases/stock-order/GetStockOrderListUsecase";
import { GetMatchStockOrderListParams } from "../../../../application/params/stock-order/GetMatchStockOrderListParams";
import { InvalidGetMatchStockOrderListParamsError } from "../../../../application/errors/params/stock-order/InvalidGetMatchStockOrderListParamsError";
import { GetMatchStockOrderListUsecase } from "../../../../application/usecases/stock-order/GetMatchStockOrderListUsecase";
import { AcceptStockOrderParams } from "../../../../application/params/stock-order/AcceptStockOrderParams";
import { InvalidAcceptStockOrderParamsError } from "../../../../application/errors/params/stock-order/InvalidAcceptStockOrderParamsError";
import {
  AcceptStockOrderBody,
  AcceptStockOrderCommand,
} from "../../../../application/commands/stock-order/AcceptStockOrderCommand";
import { InvalidAcceptStockOrderCommandError } from "../../../../application/errors/commands/stock-order/InvalidAcceptStockOrderCommandError";
import { AcceptStockOrderUsecase } from "../../../../application/usecases/stock-order/AcceptStockOrderUsecase";
import { SettingRepositoryInterface } from "../../../../application/repositories/SettingRepositoryInterface";
import { SendStockPurchaseSucceedEmailUsecase } from "../../../../application/usecases/email/SendStockPurchaseSucceedEmailUsecase";
import { SendStockSaleSucceedEmailUsecase } from "../../../../application/usecases/email/SendStockSaleSucceedEmailUsecase";
import { DeleteStockOrderParams } from "../../../../application/params/stock-order/DeleteStockOrderParams";
import { InvalidDeleteStockOrderParamsError } from "../../../../application/errors/params/stock-order/InvalidDeleteStockOrderParamsError";
import { DeleteStockOrderUsecase } from "../../../../application/usecases/stock-order/DeleteStockOrderUsecase";
import { StockOrderNotFoundError } from "../../../../domain/errors/entities/stock-order/StockOrderNotFoundError";
import { StockRepositoryInterface } from "../../../../application/repositories/StockRepositoryInterface";
import { FinancialSecurityRepositoryInterface } from "../../../../application/repositories/FinancialSecurityRepositoryInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { CreateStockOrderPayloadInterface } from "../../../../application/services/api/resources/StockOrderResourceInterface";

export class StockOrderController {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
    private readonly settingRepository: SettingRepositoryInterface,
    private readonly financialSecurityRepository: FinancialSecurityRepositoryInterface,
    private readonly mailer: MailerInterface
  ) {}

  public async create(
    request: FastifyRequest<{ Body: CreateStockOrderPayloadInterface }>,
    response: FastifyReply
  ) {
    const maybeCommand = CreateStockOrderCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateStockOrderCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreateStockOrderUsecase(
      this.stockRepository,
      this.stockOrderRepository,
      this.financialSecurityRepository
    );
    const maybeStockOrder = await createUsecase.execute(
      maybeCommand.amount,
      maybeCommand.type,
      owner,
      maybeCommand.stockId,
      maybeCommand.accountId
    );

    if (maybeStockOrder instanceof Error) {
      return response.status(400).send({
        error: maybeStockOrder.message,
      });
    }

    response.status(201).send({
      id: maybeStockOrder.id,
      type: maybeStockOrder.type,
      status: maybeStockOrder.status,
      amount: maybeStockOrder.amount,
      ...(maybeStockOrder.purchasePrice !== undefined && {
        purchasePrice: maybeStockOrder.purchasePrice,
      }),
    });
  }

  public async list(request: FastifyRequest, response: FastifyReply) {
    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const getStockOrderListUsecase = new GetStockOrderListUsecase(
      this.stockOrderRepository
    );
    const stockOrders = await getStockOrderListUsecase.execute(owner);

    const stockOrdersResponse = stockOrders.map((stockOrder) => ({
      id: stockOrder.id,
      type: stockOrder.type,
      status: stockOrder.status,
      amount: stockOrder.amount,
      ...(stockOrder.purchasePrice !== undefined && {
        purchasePrice: stockOrder.purchasePrice,
      }),
      ...(stockOrder.stock
        ? {
            stock: {
              id: stockOrder.stock.id,
              name: stockOrder.stock.name,
            },
          }
        : {}),
    }));

    response.status(200).send(stockOrdersResponse);
  }

  public async match(
    request: FastifyRequest<{ Params: RessourceParamsInterface }>,
    response: FastifyReply
  ) {
    const maybeParams = GetMatchStockOrderListParams.from(request.params);
    if (maybeParams instanceof InvalidGetMatchStockOrderListParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const getListUsecase = new GetMatchStockOrderListUsecase(
      this.stockRepository,
      this.stockOrderRepository
    );
    const stockOrders = await getListUsecase.execute(maybeParams.id);

    const stockOrdersResponse = stockOrders.map((stockOrder) => ({
      id: stockOrder.id,
      type: stockOrder.type,
      status: stockOrder.status,
      amount: stockOrder.amount,
      ...(stockOrder.purchasePrice !== undefined && {
        purchasePrice: stockOrder.purchasePrice,
      }),
    }));

    response.status(200).send(stockOrdersResponse);
  }

  public async accept(
    request: FastifyRequest<{
      Params: RessourceParamsInterface;
      Body: AcceptStockOrderBody;
    }>,
    response: FastifyReply
  ) {
    const maybeParams = AcceptStockOrderParams.from(request.params);
    if (maybeParams instanceof InvalidAcceptStockOrderParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = AcceptStockOrderCommand.from(request.body);
    if (maybeCommand instanceof InvalidAcceptStockOrderCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const acceptUsecase = new AcceptStockOrderUsecase(
      this.stockOrderRepository,
      this.operationRepository,
      this.settingRepository,
      this.financialSecurityRepository
    );
    const maybeFinancialSecurity = await acceptUsecase.execute(
      owner,
      maybeCommand.withId,
      maybeParams.id
    );

    if (maybeFinancialSecurity instanceof Error) {
      return response.status(400).send({
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

    const sendSaleEmailUsecase = new SendStockSaleSucceedEmailUsecase(
      this.mailer
    );
    await sendSaleEmailUsecase.execute(
      owner.email,
      maybeFinancialSecurity.stock?.name || "",
      maybeFinancialSecurity.purchasePrice
    );

    response.status(201).send({
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

  public async delete(
    request: FastifyRequest<{ Params: RessourceParamsInterface }>,
    response: FastifyReply
  ) {
    const maybeParams = DeleteStockOrderParams.from(request.params);
    if (maybeParams instanceof InvalidDeleteStockOrderParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const owner = request.user;
    if (!owner) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const deleteStockOrderUsecase = new DeleteStockOrderUsecase(
      this.stockOrderRepository
    );
    const maybeSuccess = await deleteStockOrderUsecase.execute(
      maybeParams.id,
      owner
    );

    if (maybeSuccess instanceof StockOrderNotFoundError) {
      return response.status(404).send({
        error: maybeSuccess.message,
      });
    }

    response.status(200).send({
      success: maybeSuccess,
    });
  }
}
