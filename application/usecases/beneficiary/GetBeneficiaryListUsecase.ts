import { Beneficiary } from '../../../domain/entities/Beneficiary';
import { User } from '../../../domain/entities/User';
import { BeneficiaryRepositoryInterface } from '../../repositories/BeneficiaryRepositoryInterface';

export class GetBeneficiaryListUsecase {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
    term?: string,
  ): Promise<Beneficiary[]> {
    if (!owner.id) {
      return [];
    }

    return await this.beneficiaryRepository.findAllByOwnerLike(owner.id, term || '');
  }
}

