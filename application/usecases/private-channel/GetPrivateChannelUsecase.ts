import { HydratedPrivateChannel } from "../../../domain/entities/PrivateChannel";
import { ChannelNotFoundError } from "../../../domain/errors/entities/channel/ChannelNotFoundError";
import { PrivateChannelRepositoryInterface } from "../../repositories/PrivateChannelRepositoryInterface";
import { MessageRepositoryInterface } from "../../repositories/MessageRepositoryInterface";
import { User } from "../../../domain/entities/User";

export class GetPrivateChannelUsecase {
  public constructor(
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface
  ) {}

  public async execute(
    id: number,
    user: User
  ): Promise<HydratedPrivateChannel | ChannelNotFoundError> {
    const maybePrivateChannel = await this.privateChannelRepository.findById(
      id
    );
    if (maybePrivateChannel instanceof ChannelNotFoundError) {
      return maybePrivateChannel;
    }

    if (
      maybePrivateChannel.advisorId &&
      maybePrivateChannel.advisorId !== user.id &&
      maybePrivateChannel.userId !== user.id
    ) {
      return new ChannelNotFoundError("Channel not found.");
    }

    const messages = await this.messageRepository.findByPrivateChannel(id);

    return { ...maybePrivateChannel, messages };
  }
}
