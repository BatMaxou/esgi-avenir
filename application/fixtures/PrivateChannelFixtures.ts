import { PrivateChannelRepositoryInterface } from '../repositories/PrivateChannelRepositoryInterface';
import { PrivateChannel } from '../../domain/entities/PrivateChannel';

type MockPrivateChannel = {
  title: string,
  userId: number,
  advisorId?: number,
}

export class PrivateChannelFixtures {
  public constructor(
    private readonly repository: PrivateChannelRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const privateChannels: MockPrivateChannel[] = [
      {
        title: 'Bank Credit Issue',
        userId: 2,
      },
      {
        title: 'Investment Advice',
        userId: 2,
        advisorId: 5,
      },
    ];

    for (const privateChannel of privateChannels) {
      await this.createPrivateChannel(privateChannel);
    }

    return true;
  }

  private async createPrivateChannel(mockPrivateChannel: MockPrivateChannel): Promise<boolean | Error> {
    const maybePrivateChannel = PrivateChannel.from(mockPrivateChannel);
    if (maybePrivateChannel instanceof Error) {
      return maybePrivateChannel;
    }

    const maybeError = await this.repository.create(maybePrivateChannel);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
