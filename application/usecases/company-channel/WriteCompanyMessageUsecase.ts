import { Message } from '../../../domain/entities/Message';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { MessageRepositoryInterface } from '../../repositories/MessageRepositoryInterface';
import { CompanyChannelRepositoryInterface } from '../../repositories/CompanyChannelRepositoryInterface';
import { WebsocketRessourceEnum } from '../../services/websocket/WebsocketRessourceEnum';
import { WebsocketServerInterface } from '../../services/websocket/WebsocketServerInterface';

export class WriteCompanyMessageUsecase {
  public constructor(
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
    private readonly websocketServer: WebsocketServerInterface,
  ) {}

  public async execute(
    content: string,
    channelId: number,
    author: User,
  ): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    const maybeCompanyChannel = await this.companyChannelRepository.findById(channelId);
    if (maybeCompanyChannel instanceof ChannelNotFoundError) {
      return maybeCompanyChannel;
    }

    const maybeMessage = Message.from({
      content,
      user: author,
      channel: maybeCompanyChannel,
    });
    if (
      maybeMessage instanceof ChannelNotFoundError
      || maybeMessage instanceof UserNotFoundError
    ) {
      return maybeMessage;
    }

    const maybeNewMessage = await this.messageRepository.createCompany(maybeMessage);
    if (
      maybeNewMessage instanceof ChannelNotFoundError
      || maybeNewMessage instanceof UserNotFoundError
    ) {
      return maybeNewMessage;
    }

    this.websocketServer.emitMessage({
      id: maybeNewMessage.id,
      content: maybeNewMessage.content,
      user: {
        id: maybeNewMessage.userId,
        firstName: maybeNewMessage.user?.firstName,
        lastName: maybeNewMessage.user?.lastName,
      },
      channel: {
        id: channelId,
        title: maybeNewMessage.channel?.title,
      }
    }, WebsocketRessourceEnum.COMPANY_MESSAGE, channelId)

    return maybeNewMessage;
  }
}


