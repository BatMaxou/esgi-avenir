import { HydratedCompanyChannel } from '../../../domain/entities/CompanyChannel';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { CompanyChannelRepositoryInterface } from '../../repositories/CompanyChannelRepositoryInterface';
import { MessageRepositoryInterface } from '../../repositories/MessageRepositoryInterface';

export class GetCompanyChannelUsecase {
  public constructor(
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
    private readonly messageRepository: MessageRepositoryInterface,
  ) {}

  public async execute(
    id: number,
  ): Promise<HydratedCompanyChannel | ChannelNotFoundError> {
    const maybeCompanyChannel = await this.companyChannelRepository.findById(id);
    if (maybeCompanyChannel instanceof ChannelNotFoundError) {
      return maybeCompanyChannel;
    }

    const messages = await this.messageRepository.findByCompanyChannel(id);

    return { ...maybeCompanyChannel, messages };
  }
}

