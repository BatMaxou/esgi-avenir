import { FastifyReply, FastifyRequest } from "fastify";

import { MessageRepositoryInterface } from "../../../../application/repositories/MessageRepositoryInterface";
import { PrivateChannelRepositoryInterface } from "../../../../application/repositories/PrivateChannelRepositoryInterface";
import { GetPrivateChannelListUsecase } from "../../../../application/usecases/private-channel/GetPrivateChannelListUsecase";
import { GetPrivateChannelUsecase } from "../../../../application/usecases/private-channel/GetPrivateChannelUsecase";
import { UpdatePrivateChannelUsecase } from "../../../../application/usecases/private-channel/UpdatePrivateChannelUsecase";
import { GetPrivateChannelParams } from "../../../../application/params/private-channel/GetPrivateChannelParams";
import { InvalidGetPrivateChannelParamsError } from "../../../../application/errors/params/private-channel/InvalidGetPrivateChannelParamsError";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { UpdatePrivateChannelParams } from "../../../../application/params/private-channel/UpdatePrivateChannelParams";
import { InvalidUpdatePrivateChannelParamsError } from "../../../../application/errors/params/private-channel/InvalidUpdatePrivateChannelParamsError";
import { UpdatePrivateChannelCommand } from "../../../../application/commands/private-channel/UpdatePrivateChannelCommand";
import { InvalidUpdatePrivateChannelCommandError } from "../../../../application/errors/commands/private-channel/InvalidUpdatePrivateChannelCommandError";
import { WritePrivateMessageUsecase } from "../../../../application/usecases/private-channel/WritePrivateMessageUsecase";
import { WritePrivateMessageParams } from "../../../../application/params/private-channel/WritePrivateMessageParams";
import { InvalidWritePrivateMessageParamsError } from "../../../../application/errors/params/private-channel/InvalidWritePrivateMessageParamsError";
import { WritePrivateMessageCommand } from "../../../../application/commands/private-channel/WritePrivateMessageCommand";
import { InvalidWritePrivateMessageCommandError } from "../../../../application/errors/commands/private-channel/InvalidWritePrivateMessageCommandError";
import { AttributePrivateChannelToParams } from "../../../../application/params/private-channel/AttributePrivateChannelToParams";
import { InvalidAttributePrivateChannelToParamsError } from "../../../../application/errors/params/private-channel/InvalidAttributePrivateChannelToParamsError";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { UpdatePrivateChannelPayloadInterface, WritePrivateMessagePayloadInterface } from "../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { WebsocketServerInterface } from "../../../../application/services/websocket/WebsocketServerInterface";

export class PrivateChannelController {
  public constructor(
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
    private readonly websocketServer: WebsocketServerInterface,
  ) {}

  public async list(request: FastifyRequest, response: FastifyReply) {
    const user = request.user;
    if (!user) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const getListUsecase = new GetPrivateChannelListUsecase(
      this.privateChannelRepository,
    );

    const privateChannels = await getListUsecase.execute(user);

    response.status(200).send(privateChannels.map((privateChannel) => ({
      id: privateChannel.id,
      title: privateChannel.title,
    })));
  }

  public async get(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = GetPrivateChannelParams.from(request.params);
    if (maybeParams instanceof InvalidGetPrivateChannelParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const user = request.user;
    if (!user) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const getPrivateChannelUsecase = new GetPrivateChannelUsecase(
      this.privateChannelRepository,
      this.messageRepository
    );
    const maybePrivateChannel = await getPrivateChannelUsecase.execute(maybeParams.id, user);
    if (maybePrivateChannel instanceof ChannelNotFoundError) {
      return response.status(404).send({
        error: maybePrivateChannel.message,
      });
    }

    response.status(200).send({
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

  public async update(request: FastifyRequest<{Params: RessourceParamsInterface, Body: UpdatePrivateChannelPayloadInterface}>, response: FastifyReply) {
    const maybeParams = UpdatePrivateChannelParams.from(request.params);
    if (maybeParams instanceof InvalidUpdatePrivateChannelParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdatePrivateChannelCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdatePrivateChannelCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const user = request.user;
    if (!user) {
      return response.status(401).send({
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
      return response.status(404).send({
        error: maybePrivateChannel.message,
      });
    }

    response.status(200).send({
      id: maybePrivateChannel.id,
      title: maybePrivateChannel.title,
    });
  }

  public async writeMessage(request: FastifyRequest<{Params: RessourceParamsInterface, Body: WritePrivateMessagePayloadInterface}>, response: FastifyReply) {
    const maybeParams = WritePrivateMessageParams.from(request.params);
    if (maybeParams instanceof InvalidWritePrivateMessageParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = WritePrivateMessageCommand.from(request.body);
    if (maybeCommand instanceof InvalidWritePrivateMessageCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const user = request.user;
    if (!user) {
      return response.status(401).send({
        error: "Unauthorized",
      });
    }

    const writeMessageUsecase = new WritePrivateMessageUsecase(
      this.privateChannelRepository,
      this.messageRepository,
      this.websocketServer,
    );
    const maybeMessage = await writeMessageUsecase.execute(
      maybeCommand.content,
      maybeParams.id,
      user,
    ); 

    if (maybeMessage instanceof Error) {
      return response.status(404).send({
        error: maybeMessage.message,
      });
    }

    response.status(200).send({
      id: maybeMessage.id,
      content: maybeMessage.content,
    });
  }

  public async attributeTo(request: FastifyRequest<{Params: RessourceParamsInterface}>, response: FastifyReply) {
    const maybeParams = AttributePrivateChannelToParams.from(request.params);
    if (maybeParams instanceof InvalidAttributePrivateChannelToParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const advisor = request.user;
    if (!advisor) {
      return response.status(401).send({
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
      return response.status(404).send({
        error: maybePrivateChannel.message,
      });
    }

    response.status(200).send({
      id: maybePrivateChannel.id,
      title: maybePrivateChannel.title,
    });
  }
}

