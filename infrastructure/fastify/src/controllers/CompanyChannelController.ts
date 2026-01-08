import { FastifyReply, FastifyRequest } from "fastify";

import { MessageRepositoryInterface } from "../../../../application/repositories/MessageRepositoryInterface";
import { CompanyChannelRepositoryInterface } from "../../../../application/repositories/CompanyChannelRepositoryInterface";
import { GetCompanyChannelListUsecase } from "../../../../application/usecases/company-channel/GetCompanyChannelListUsecase";
import { GetCompanyChannelUsecase } from "../../../../application/usecases/company-channel/GetCompanyChannelUsecase";
import { UpdateCompanyChannelUsecase } from "../../../../application/usecases/company-channel/UpdateCompanyChannelUsecase";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { WriteCompanyMessageUsecase } from "../../../../application/usecases/company-channel/WriteCompanyMessageUsecase";
import { CreateCompanyChannelUsecase } from "../../../../application/usecases/company-channel/CreateCompanyChannelUsecase";
import { CreateCompanyChannelCommand } from "../../../../application/commands/company-channel/CreateCompanyChannelCommand";
import { InvalidCreateCompanyChannelCommandError } from "../../../../application/errors/commands/company-channel/InvalidCreateCompanyChannelCommandError";
import { GetCompanyChannelParams } from "../../../../application/params/company-channel/GetCompanyChannelParams";
import { InvalidGetCompanyChannelParamsError } from "../../../../application/errors/params/company-channel/InvalidGetCompanyChannelParamsError";
import { UpdateCompanyChannelParams } from "../../../../application/params/company-channel/UpdateCompanyChannelParams";
import { InvalidUpdateCompanyChannelParamsError } from "../../../../application/errors/params/company-channel/InvalidUpdateCompanyChannelParamsError";
import { UpdateCompanyChannelCommand } from "../../../../application/commands/company-channel/UpdateCompanyChannelCommand";
import { InvalidUpdateCompanyChannelCommandError } from "../../../../application/errors/commands/company-channel/InvalidUpdateCompanyChannelCommandError";
import { WriteCompanyMessageParams } from "../../../../application/params/company-channel/WriteCompanyMessageParams";
import { InvalidWriteCompanyMessageParamsError } from "../../../../application/errors/params/company-channel/InvalidWriteCompanyMessageParamsError";
import { WriteCompanyMessageCommand } from "../../../../application/commands/company-channel/WriteCompanyMessageCommand";
import { InvalidWriteCompanyMessageCommandError } from "../../../../application/errors/commands/company-channel/InvalidWriteCompanyMessageCommandError";
import {
  CreateCompanyChannelPayloadInterface,
  UpdateCompanyChannelPayloadInterface,
  WriteCompanyMessagePayloadInterface,
} from "../../../../application/services/api/resources/CompanyChannelResourceInterface";
import { RessourceParamsInterface } from "../../../../application/params/RessourceParamsInterface";
import { WebsocketServerInterface } from "../../../../application/services/websocket/WebsocketServerInterface";

export class CompanyChannelController {
  public constructor(
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
    private readonly websocketServer: WebsocketServerInterface
  ) {}

  public async create(
    request: FastifyRequest<{ Body: CreateCompanyChannelPayloadInterface }>,
    response: FastifyReply
  ) {
    const maybeCommand = CreateCompanyChannelCommand.from(request.body);
    if (maybeCommand instanceof InvalidCreateCompanyChannelCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const createUsecase = new CreateCompanyChannelUsecase(
      this.companyChannelRepository
    );
    const maybeCompanyChannel = await createUsecase.execute(maybeCommand.title);

    response.status(201).send({
      id: maybeCompanyChannel.id,
      title: maybeCompanyChannel.title,
    });
  }

  public async list(request: FastifyRequest, response: FastifyReply) {
    const getListUsecase = new GetCompanyChannelListUsecase(
      this.companyChannelRepository
    );

    const companyChannels = await getListUsecase.execute();

    response.status(200).send(
      companyChannels.map((companyChannel) => ({
        id: companyChannel.id,
        title: companyChannel.title,
      }))
    );
  }

  public async get(
    request: FastifyRequest<{ Params: RessourceParamsInterface }>,
    response: FastifyReply
  ) {
    const maybeParams = GetCompanyChannelParams.from(request.params);
    if (maybeParams instanceof InvalidGetCompanyChannelParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const getCompanyChannelUsecase = new GetCompanyChannelUsecase(
      this.companyChannelRepository,
      this.messageRepository
    );
    const maybeCompanyChannel = await getCompanyChannelUsecase.execute(
      maybeParams.id
    );
    if (maybeCompanyChannel instanceof ChannelNotFoundError) {
      return response.status(404).send({
        error: maybeCompanyChannel.message,
      });
    }

    response.status(200).send({
      id: maybeCompanyChannel.id,
      title: maybeCompanyChannel.title,
      messages: maybeCompanyChannel.messages.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        user: message.user
          ? {
              id: message.user.id,
              firstName: message.user.firstName,
              lastName: message.user.lastName,
              roles: message.user.roles,
            }
          : null,
      })),
    });
  }

  public async update(
    request: FastifyRequest<{
      Params: RessourceParamsInterface;
      Body: UpdateCompanyChannelPayloadInterface;
    }>,
    response: FastifyReply
  ) {
    const maybeParams = UpdateCompanyChannelParams.from(request.params);
    if (maybeParams instanceof InvalidUpdateCompanyChannelParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = UpdateCompanyChannelCommand.from(request.body);
    if (maybeCommand instanceof InvalidUpdateCompanyChannelCommandError) {
      return response.status(400).send({
        error: maybeCommand.message,
      });
    }

    const updateCompanyChannelUsecase = new UpdateCompanyChannelUsecase(
      this.companyChannelRepository
    );
    const maybeCompanyChannel = await updateCompanyChannelUsecase.execute({
      id: maybeParams.id,
      title: maybeCommand.title,
    });

    if (maybeCompanyChannel instanceof Error) {
      return response.status(404).send({
        error: maybeCompanyChannel.message,
      });
    }

    response.status(200).send({
      id: maybeCompanyChannel.id,
      title: maybeCompanyChannel.title,
    });
  }

  public async writeMessage(
    request: FastifyRequest<{
      Params: RessourceParamsInterface;
      Body: WriteCompanyMessagePayloadInterface;
    }>,
    response: FastifyReply
  ) {
    const maybeParams = WriteCompanyMessageParams.from(request.params);
    if (maybeParams instanceof InvalidWriteCompanyMessageParamsError) {
      return response.status(400).send({
        error: maybeParams.message,
      });
    }

    const maybeCommand = WriteCompanyMessageCommand.from(request.body);
    if (maybeCommand instanceof InvalidWriteCompanyMessageCommandError) {
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

    const writeMessageUsecase = new WriteCompanyMessageUsecase(
      this.companyChannelRepository,
      this.messageRepository,
      this.websocketServer
    );
    const maybeMessage = await writeMessageUsecase.execute(
      maybeCommand.content,
      maybeParams.id,
      user
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
}
