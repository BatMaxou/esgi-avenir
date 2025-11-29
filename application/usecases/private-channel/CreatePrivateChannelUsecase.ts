import { Message } from '../../../domain/entities/Message';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { PrivateChannel } from '../../../domain/entities/PrivateChannel';
import { MessageRepositoryInterface } from '../../repositories/MessageRepositoryInterface';
import { PrivateChannelRepositoryInterface } from '../../repositories/PrivateChannelRepositoryInterface';

export class CreatePrivateChannelUsecase {
  public constructor(
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
  ) {}

  public async execute(
    title: string,
    content: string,
    user: User,
  ): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    if (!user.id) {
      return new UserNotFoundError('User not found.');
    }

    const maybePrivateChannel = PrivateChannel.from({
      title,
      userId: user.id,
    })
    if (maybePrivateChannel instanceof UserNotFoundError) {
      return maybePrivateChannel;
    }

    const maybeNewPrivateChannel = await this.privateChannelRepository.create(maybePrivateChannel);
    if (maybeNewPrivateChannel instanceof UserNotFoundError) {
      return maybeNewPrivateChannel;
    }

    const maybeMessage = Message.from({
      content,
      user,
      channel: maybeNewPrivateChannel,
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

