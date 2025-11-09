import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { EmailExistsError } from '../../../domain/errors/entities/user/EmailExistsError';
import { HashedPasswordValue } from '../../../domain/values/HashedPasswordValue';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';
import { PasswordHasherInterface } from '../../services/password/PasswordHasherInterface';

export class UpdateUserUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute(
    id: number,
    toUpdate: Partial<Omit<User, 'id'>>,
  ): Promise<User | UserNotFoundError | EmailExistsError> {
    return await this.userRepository.update({
      id,
      ...toUpdate,
      ...(toUpdate.password
        ? { password: HashedPasswordValue.from(this.passwordHasher.createHash(toUpdate.password.value)) }
        : {}
      ),
    });
  }
}

