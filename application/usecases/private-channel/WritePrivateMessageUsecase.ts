import { Message } from '../../../domain/entities/Message';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { MessageRepositoryInterface } from '../../repositories/MessageRepositoryInterface';
import { PrivateChannelRepositoryInterface } from '../../repositories/PrivateChannelRepositoryInterface';

export class WritePrivateMessageUsecase {
  public constructor(
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
  ) {}

  public async execute(
    content: string,
    channelId: number,
    author: User,
  ): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    const maybePrivateChannel = await this.privateChannelRepository.findById(channelId);
    if (maybePrivateChannel instanceof ChannelNotFoundError) {
      return maybePrivateChannel;
    }

    if (maybePrivateChannel.advisorId !== author.id && maybePrivateChannel.userId !== author.id) {
      return new ChannelNotFoundError('Channel not found.');
    }

    const maybeMessage = Message.from({
      content,
      user: author,
      channel: maybePrivateChannel,
    });
    if (
      maybeMessage instanceof ChannelNotFoundError
      || maybeMessage instanceof UserNotFoundError
    ) {
      return maybeMessage;
    }

    return this.messageRepository.createPrivate(maybeMessage);
  }
}

