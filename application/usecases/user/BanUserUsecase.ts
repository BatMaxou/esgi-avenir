import { User } from '../../../domain/entities/User';
import { RoleEnum } from '../../../domain/enums/RoleEnum';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class BanUserUsecase {
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

    if (maybeUser.roles.includes(RoleEnum.BANNED)) {
      return maybeUser;
    }

    maybeUser.roles.push(RoleEnum.BANNED);

    return await this.userRepository.update({
      id,
      roles: maybeUser.roles,
    });
  }
}

