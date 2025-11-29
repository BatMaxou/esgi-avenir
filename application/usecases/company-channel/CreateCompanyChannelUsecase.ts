import { CompanyChannel } from '../../../domain/entities/CompanyChannel';
import { CompanyChannelRepositoryInterface } from '../../repositories/CompanyChannelRepositoryInterface';

export class CreateCompanyChannelUsecase {
  public constructor(
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
  ) {}

  public async execute(
    title: string,
  ): Promise<CompanyChannel> {
    const newCompanyChannel = CompanyChannel.from({
      title,
    })

    return this.companyChannelRepository.create(newCompanyChannel);
  }
}

