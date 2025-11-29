import { PrivateChannelRepositoryInterface, UpdatePrivateChannelPayload } from '../../repositories/PrivateChannelRepositoryInterface';
import { PrivateChannel } from '../../../domain/entities/PrivateChannel';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { User } from '../../../domain/entities/User';

export class UpdatePrivateChannelUsecase {
  public constructor(
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
  ) {}

  public async execute(
    privateChannel: UpdatePrivateChannelPayload,
    user: User,
  ): Promise<PrivateChannel | ChannelNotFoundError> {
    const { id } = privateChannel;

    const maybePrivateChannel = await this.privateChannelRepository.findById(id);
    if (maybePrivateChannel instanceof ChannelNotFoundError) {
      return maybePrivateChannel;
    }

    if ((maybePrivateChannel.advisorId && maybePrivateChannel.advisorId !== user.id) && maybePrivateChannel.userId !== user.id) {
      return new ChannelNotFoundError('Channel not found.');
    }

    return await this.privateChannelRepository.update(privateChannel);
  }
}

