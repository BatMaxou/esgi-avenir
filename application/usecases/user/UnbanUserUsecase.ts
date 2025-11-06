import { User } from '../../../domain/entities/User';
import { RoleEnum } from '../../../domain/enums/RoleEnum';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class UnbanUserUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(
    id: number,
  ): Promise<User | UserNotFoundError> {
    const maybeUser = await this.userRepository.findById(id);
    if (maybeUser instanceof UserNotFoundError) {
      return maybeUser;
    }

    return await this.userRepository.update({
      id,
      roles: maybeUser.roles.filter(role => role !== RoleEnum.BANNED),
    });
  }
}

