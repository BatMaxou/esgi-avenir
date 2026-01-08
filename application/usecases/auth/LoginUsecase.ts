import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { UserNotEnabledError } from '../../../domain/errors/entities/user/UserNotEnabledError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';
import { PasswordHasherInterface } from '../../services/password/PasswordHasherInterface';

export class LoginUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute(email: string, password: string): Promise<User | UserNotFoundError | UserNotEnabledError> {
    const maybeUser = await this.userRepository.findByEmail(email);
    if (maybeUser instanceof UserNotFoundError) {
      return maybeUser;
    }

    const isValidated = maybeUser.enabled;
    if (!isValidated) {
      return new UserNotEnabledError('User account is not enabled yet.');
    }

    const isPasswordValid = this.passwordHasher.verify(password, maybeUser.password.value);
    if (!isPasswordValid) {
      return new UserNotFoundError('Invalid credentials.');
    }

    return maybeUser;
  }
}

