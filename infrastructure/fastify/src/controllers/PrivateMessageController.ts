import { FastifyReply, FastifyRequest } from "fastify";

import { CreatePrivateMessageCommand } from "../../../../application/commands/private-message/CreatePrivateMessageCommand";
import { InvalidCreatePrivateMessageCommandError } from "../../../../application/errors/commands/private-message/InvalidCreatePrivateMessageCommandError";
import { MessageRepositoryInterface } from "../../../../application/repositories/MessageRepositoryInterface";
import { CreatePrivateChannelUsecase } from "../../../../application/usecases/private-channel/CreatePrivateChannelUsecase";
import { PrivateChannelRepositoryInterface } from "../../../../application/repositories/PrivateChannelRepositoryInterface";
import { CreatePrivateMessagePayloadInterface } from "../../../../application/services/api/resources/PrivateMessageResourceInterface";

export class PrivateMessageController {
  public constructor(
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface
  ) {}

  public async create(
    request: FastifyRequest<{ Body: CreatePrivateMessagePayloadInterface }>,
    response: FastifyReply
  ) {
    const maybeCommand = CreatePrivateMessageCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreatePrivateMessageCommandError) {
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

    const createUsecase = new CreatePrivateChannelUsecase(
      this.privateChannelRepository,
      this.messageRepository
    );
    const maybePrivateMessage = await createUsecase.execute(
      maybeCommand.title,
      maybeCommand.content,
      user
    );

    if (maybePrivateMessage instanceof Error) {
      return response.status(400).send({
        error: maybePrivateMessage.message,
      });
    }

    const channel = await this.privateChannelRepository.findById(
      maybePrivateMessage.channelId
    );

    if (channel instanceof Error) {
      return response.status(400).send({
        error: channel.message,
      });
    }

    response.status(201).send(channel);
  }
}
