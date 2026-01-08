import { User } from '../../../domain/entities/User';
import { BeneficiaryRepositoryInterface, UpdateBeneficiaryPayload } from '../../repositories/BeneficiaryRepositoryInterface';
import { Beneficiary } from '../../../domain/entities/Beneficiary';
import { BeneficiaryNotFoundError } from '../../../domain/errors/entities/beneficiary/BeneficiaryNotFoundError';

export class UpdateBeneficiaryUsecase {
  public constructor(
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
  ) {}

  public async execute(
    owner: User,
    beneficiary: UpdateBeneficiaryPayload,
  ): Promise<Beneficiary | BeneficiaryNotFoundError> {
    const { id } = beneficiary;

    const maybeBeneficiary = await this.beneficiaryRepository.findById(id);
    if (maybeBeneficiary instanceof BeneficiaryNotFoundError) {
      return maybeBeneficiary;
    }

    if (maybeBeneficiary.ownerId !== owner.id) {
      return new BeneficiaryNotFoundError('Beneficiary not found.');
    }

    return await this.beneficiaryRepository.update(beneficiary);
  }
}

