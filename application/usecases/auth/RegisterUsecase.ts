import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { EmailExistsError } from '../../../domain/errors/values/email/EmailExistsError';
import { InvalidEmailError } from '../../../domain/errors/values/email/InvalidEmailError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';
import { MailerInterface } from '../../services/email/MailerInterface';
import { InvalidPasswordError } from '../../../domain/errors/values/password/InvalidPasswordError';
import { PasswordHasherInterface } from '../../services/password/PasswordHasherInterface';
import { UniqueIdGeneratorInterface } from '../../services/uid/UniqueIdGeneratorInterface';

export class RegisterUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly uniqueIdGenerator: UniqueIdGeneratorInterface,
  ) {}

  public async execute(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User | EmailExistsError | InvalidEmailError> {
    const maybeNewUser = User.from({
      firstName,
      lastName,
      email,
      password: this.passwordHasher.createHash(password),
      confirmationToken: this.uniqueIdGenerator.generate(),
    });

    if (
      maybeNewUser instanceof InvalidEmailError
      || maybeNewUser instanceof InvalidPasswordError
    ) {
      return maybeNewUser;
    }

    return await this.userRepository.create(maybeNewUser);
  }
}

