import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class DeleteUserUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(
    id: number,
  ): Promise<boolean | UserNotFoundError> {
    return await this.userRepository.delete(id);
  }
}

