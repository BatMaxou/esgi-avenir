import { Request, Response } from "express";

import { CreatePrivateMessageCommand } from "../../../domain/commands/private-message/CreatePrivateMessageCommand";
import { InvalidCreatePrivateMessageCommandError } from "../../../domain/errors/commands/private-message/InvalidCreatePrivateMessageCommandError";
import { MessageRepositoryInterface } from "../../../application/repositories/MessageRepositoryInterface";
import { CreatePrivateChannelUsecase } from "../../../application/usecases/private-channel/CreatePrivateChannelUsecase";
import { PrivateChannelRepositoryInterface } from "../../../application/repositories/PrivateChannelRepositoryInterface";

export class PrivateMessageController {
  public constructor(
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
  ) {}

  public async create(request: Request, response: Response) {
    const maybeCommand = CreatePrivateMessageCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreatePrivateMessageCommandError) {
      return response.status(400).json({
        error: maybeCommand.message,
      });
    }

    const user = request.user;
    if (!user) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const createUsecase = new CreatePrivateChannelUsecase(this.privateChannelRepository, this.messageRepository);
    const maybePrivateMessage = await createUsecase.execute(
      maybeCommand.title,
      maybeCommand.content,
      user,
    );

    if (maybePrivateMessage instanceof Error) {
      return response.status(400).json({
        error: maybePrivateMessage.message,
      });
    }

    response.status(201).json({
      id: maybePrivateMessage.id,
      content: maybePrivateMessage.content,
    });
  }
}
