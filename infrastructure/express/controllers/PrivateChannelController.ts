import { Request, Response } from "express";

import { MessageRepositoryInterface } from "../../../application/repositories/MessageRepositoryInterface";
import { PrivateChannelRepositoryInterface } from "../../../application/repositories/PrivateChannelRepositoryInterface";
import { GetPrivateChannelListUsecase } from "../../../application/usecases/private-channel/GetPrivateChannelListUsecase";
import { GetPrivateChannelUsecase } from "../../../application/usecases/private-channel/GetPrivateChannelUsecase";
import { UpdatePrivateChannelUsecase } from "../../../application/usecases/private-channel/UpdatePrivateChannelUsecase";
import { GetPrivateChannelParams } from "../../../domain/params/private-channel/GetPrivateChannelParams";
import { InvalidGetPrivateChannelParamsError } from "../../../domain/errors/params/private-channel/InvalidGetPrivateChannelParamsError";
import { ChannelNotFoundError } from "../../../domain/errors/entities/channel/ChannelNotFoundError";
import { UpdatePrivateChannelParams } from "../../../domain/params/private-channel/UpdatePrivateChannelParams";
import { InvalidUpdatePrivateChannelParamsError } from "../../../domain/errors/params/private-channel/InvalidUpdatePrivateChannelParamsError";
import { UpdatePrivateChannelCommand } from "../../../domain/commands/private-channel/UpdatePrivateChannelCommand";
import { InvalidUpdatePrivateChannelCommandError } from "../../../domain/errors/commands/private-channel/InvalidUpdatePrivateChannelCommandError";
import { WritePrivateMessageUsecase } from "../../../application/usecases/private-channel/WritePrivateMessageUsecase";
import { WritePrivateMessageParams } from "../../../domain/params/private-channel/WritePrivateMessageParams";
import { InvalidWritePrivateMessageParamsError } from "../../../domain/errors/params/private-channel/InvalidWritePrivateMessageParamsError";
import { WritePrivateMessageCommand } from "../../../domain/commands/private-channel/WritePrivateMessageCommand";
import { InvalidWritePrivateMessageCommandError } from "../../../domain/errors/commands/private-channel/InvalidWritePrivateMessageCommandError";
import { AttributePrivateChannelToParams } from "../../../domain/params/private-channel/AttributePrivateChannelToParams";
import { InvalidAttributePrivateChannelToParamsError } from "../../../domain/errors/params/private-channel/InvalidAttributePrivateChannelToParamsError";

export class PrivateChannelController {
  public constructor(
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
  ) {}

  public async list(request: Request, response: Response) {
    const user = request.user;
    if (!user) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetPrivateChannelListUsecase(
      this.privateChannelRepository,
    );

    const privateChannels = await getListUsecase.execute(user);

    response.status(200).json(privateChannels.map((privateChannel) => ({
      id: privateChannel.id,
      title: privateChannel.title,
    })));
  }

  public async get(request: Request, response: Response) {
    const maybeParams = GetPrivateChannelParams.from(request.params);
    if (maybeParams instanceof InvalidGetPrivateChannelParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const user = request.user;
    if (!user) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const getPrivateChannelUsecase = new GetPrivateChannelUsecase(
      this.privateChannelRepository,
      this.messageRepository
    );
    const maybePrivateChannel = await getPrivateChannelUsecase.execute(maybeParams.id, user);
    if (maybePrivateChannel instanceof ChannelNotFoundError) {
      return response.status(404).json({
        error: maybePrivateChannel.message,
      });
    }

    response.status(200).json({
      id: maybePrivateChannel.id,
      title: maybePrivateChannel.title,
      messages: maybePrivateChannel.messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        user: message.user ? {
          id: message.user.id,
          firstName: message.user.firstName,
          lastName: message.user.lastName,
        } : null,
      })),
    });
  }

  public async update(request: Request, response: Response) {
    const maybeParams = UpdatePrivateChannelParams.from(request.params);
    if (maybeParams instanceof InvalidUpdatePrivateChannelParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdatePrivateChannelCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdatePrivateChannelCommandError) {
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

    const updatePrivateChannelUsecase = new UpdatePrivateChannelUsecase(
      this.privateChannelRepository
    );
    const maybePrivateChannel = await updatePrivateChannelUsecase.execute({
      id: maybeParams.id,
      title: maybeCommand.title,
    }, user);

    if (maybePrivateChannel instanceof Error) {
      return response.status(404).json({
        error: maybePrivateChannel.message,
      });
    }

    response.status(200).json({
      id: maybePrivateChannel.id,
      title: maybePrivateChannel.title,
    });
  }

  public async writeMessage(request: Request, response: Response) {
    const maybeParams = WritePrivateMessageParams.from(request.params);
    if (maybeParams instanceof InvalidWritePrivateMessageParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const maybeCommand = WritePrivateMessageCommand.from(request.body);
    if (maybeCommand instanceof InvalidWritePrivateMessageCommandError) {
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

    const writeMessageUsecase = new WritePrivateMessageUsecase(
      this.privateChannelRepository,
      this.messageRepository
    );
    const maybeMessage = await writeMessageUsecase.execute(
      maybeCommand.content,
      maybeParams.id,
      user,
    ); 

    if (maybeMessage instanceof Error) {
      return response.status(404).json({
        error: maybeMessage.message,
      });
    }

    response.status(200).json({
      id: maybeMessage.id,
      content: maybeMessage.content,
    });
  }

  public async attributeTo(request: Request, response: Response) {
    const maybeParams = AttributePrivateChannelToParams.from(request.params);
    if (maybeParams instanceof InvalidAttributePrivateChannelToParamsError) {
      return response.status(400).json({
        error: maybeParams.message,
      });
    }

    const advisor = request.user;
    if (!advisor) {
      return response.status(401).json({
        error: "Unauthorized",
      });
    }

    const updateUsecase = new UpdatePrivateChannelUsecase(
      this.privateChannelRepository
    );
    const maybePrivateChannel = await updateUsecase.execute({
      id: maybeParams.id,
      advisorId: advisor.id,
    }, advisor);

    if (maybePrivateChannel instanceof Error) {
      return response.status(404).json({
        error: maybePrivateChannel.message,
      });
    }

    response.status(200).json({
      id: maybePrivateChannel.id,
      title: maybePrivateChannel.title,
    });
  }
}

