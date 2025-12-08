import { Request, Response } from "express";

import { OperationRepositoryInterface } from "../../../application/repositories/OperationRepositoryInterface";
import { CreateOperationCommand } from "../../../application/commands/operation/CreateOperationCommand";
import { InvalidCreateOperationCommandError } from "../../../application/errors/commands/operation/InvalidCreateOperationCommandError";
import { CreateOperationUsecase } from "../../../application/usecases/operation/CreateOperationUsecase";
import { AccountRepositoryInterface } from "../../../application/repositories/AccountRepositoryInterface";

export class OperationController {
  public constructor(
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly operationRepository: OperationRepositoryInterface,
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreateOperationCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateOperationCommandError) {
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

    const createUsecase = new CreateOperationUsecase(this.accountRepository, this.operationRepository)
    const maybeOperation = await createUsecase.execute(
      maybeCommand.type,
      maybeCommand.amount,
      maybeCommand.fromId,
      maybeCommand.toId,
      owner,
      maybeCommand.name,
    );

    if (maybeOperation instanceof Error) {
      return response.status(400).json({
        error: maybeOperation.message,
      });
    }

    response.status(201).json(maybeOperation);
  }
}
