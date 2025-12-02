import { PrivateChannel } from '../../../domain/entities/PrivateChannel';
import { User } from '../../../domain/entities/User';
import { PrivateChannelRepositoryInterface } from '../../repositories/PrivateChannelRepositoryInterface';

export class GetPrivateChannelListUsecase {
  public constructor(
    private readonly privateChannelRepository: PrivateChannelRepositoryInterface,
  ) {}

  public async execute(
    user: User,
  ): Promise<PrivateChannel[]> {
    if (!user.id) {
      return [];
    }

    if (user.isAdvisor()) {
      return this.privateChannelRepository.findAllByAdvisor(user.id);
    }

    return this.privateChannelRepository.findAllByUser(user.id);
  }
}

