import { User } from '../../../domain/entities/User';
import { BeneficiaryNotFoundError } from '../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError';
import { BeneficiaryRepositoryInterface } from '../../repositories/BeneficiaryRepositoryInterface';

export class DeleteBeneficiaryUsecase {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
  ) {}

  public async execute(
    id: number,
    owner: User,
  ): Promise<boolean | BeneficiaryNotFoundError> {
    const maybeBeneficiary = await this.beneficiaryRepository.findById(id);
    if (maybeBeneficiary instanceof BeneficiaryNotFoundError) {
      return maybeBeneficiary;
    }

    if (maybeBeneficiary.ownerId !== owner.id) {
      return new BeneficiaryNotFoundError('Beneficiary not found.');
    }

    return await this.beneficiaryRepository.delete(id);
  }
}

