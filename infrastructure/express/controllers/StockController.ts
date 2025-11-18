import { Request, Response } from "express";

import { StockRepositoryInterface } from "../../../application/repositories/StockRepositoryInterface";
import { CreateStockCommand } from "../../../domain/commands/stock/CreateStockCommand";
import { InvalidCreateStockCommandError } from "../../../domain/errors/commands/stock/InvalidCreateStockCommandError";
import { InvalidUpdateStockCommandError } from "../../../domain/errors/commands/stock/InvalidUpdateStockCommandError";
import { StockNotFoundError } from "../../../domain/errors/entities/stock/StockNotFoundError";
import { UpdateStockCommand } from "../../../domain/commands/stock/UpdateStockCommand";
import { UpdateStockParams } from "../../../domain/params/stock/UpdateStockParams";
import { InvalidUpdateStockParamsError } from "../../../domain/errors/params/stock/InvalidUpdateStockParamsError";
import { CreateStockUsecase } from "../../../application/usecases/stock/CreateStockUsecase"
import { UpdateStockUsecase } from "../../../application/usecases/stock/UpdateStockUsecase";

export class StockController {
  public constructor(
    private readonly stockRepository: StockRepositoryInterface,
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
        error: 'Unauthorized',
      });
    }

    const createUsecase = new CreateStockUsecase(this.stockRepository);
    const maybeStock = await createUsecase.execute(
      maybeCommand.name,
      maybeCommand.baseQuantity,
      maybeCommand.basePrice,
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
    const maybeStock = await updateStockUsecase.execute(
      maybeParams.id,
      {
        name: maybeCommand.name,
        baseQuantity: maybeCommand.baseQuantity,
      }
    );

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
}
