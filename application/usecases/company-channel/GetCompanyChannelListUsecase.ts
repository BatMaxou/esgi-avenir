import { CompanyChannel } from '../../../domain/entities/CompanyChannel';
import { CompanyChannelRepositoryInterface } from '../../repositories/CompanyChannelRepositoryInterface';

export class GetCompanyChannelListUsecase {
  public constructor(
    private readonly companyChannelRepository: CompanyChannelRepositoryInterface,
  ) {}

  public async execute(): Promise<CompanyChannel[]> {
    return this.companyChannelRepository.findAll();
  }
}

