import { Message } from '../../../domain/entities/Message';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { MessageRepositoryInterface } from '../../repositories/MessageRepositoryInterface';
import { CompanyChannelRepositoryInterface } from '../../repositories/CompanyChannelRepositoryInterface';

export class WriteCompanyMessageUsecase {
  public constructor(
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
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

    return this.messageRepository.createCompany(maybeMessage);
  }
}

