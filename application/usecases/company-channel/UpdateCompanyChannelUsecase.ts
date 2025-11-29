import { CompanyChannelRepositoryInterface, UpdateCompanyChannelPayload } from '../../repositories/CompanyChannelRepositoryInterface';
import { CompanyChannel } from '../../../domain/entities/CompanyChannel';
import { ChannelNotFoundError } from '../../../domain/errors/entities/channel/ChannelNotFoundError';
import { User } from '../../../domain/entities/User';

export class UpdateCompanyChannelUsecase {
  public constructor(
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
  ) {}

  public async execute(
    companyChannel: UpdateCompanyChannelPayload,
  ): Promise<CompanyChannel | ChannelNotFoundError> {
    const { id } = companyChannel;

    const maybeCompanyChannel = await this.companyChannelRepository.findById(id);
    if (maybeCompanyChannel instanceof ChannelNotFoundError) {
      return maybeCompanyChannel;
    }

    return await this.companyChannelRepository.update(companyChannel);
  }
}

