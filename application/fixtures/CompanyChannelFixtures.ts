import { CompanyChannelRepositoryInterface } from '../repositories/CompanyChannelRepositoryInterface';
import { CompanyChannel } from '../../domain/entities/CompanyChannel';

type MockCompanyChannel = {
  title: string,
}

export class CompanyChannelFixtures {
  public constructor(
    private readonly repository: CompanyChannelRepositoryInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const companyChannels: MockCompanyChannel[] = [
      {
        title: 'Avenir',
      },
      {
        title: 'Group A - Technical Support',
      },
      {
        title: 'Group B - Développement',
      },
    ];

    for (const companyChannel of companyChannels) {
      await this.createCompanyChannel(companyChannel);
    }

    return true;
  }

  private async createCompanyChannel(mockCompanyChannel: MockCompanyChannel): Promise<boolean | Error> {
    const maybeCompanyChannel = CompanyChannel.from(mockCompanyChannel);
    if (maybeCompanyChannel instanceof Error) {
      return maybeCompanyChannel;
    }

    const maybeError = await this.repository.create(maybeCompanyChannel);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
