import { User } from '../../../domain/entities/User';
import { EmailExistsError } from '../../../domain/errors/entities/user/EmailExistsError';
import { InvalidEmailError } from '../../../domain/errors/values/email/InvalidEmailError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';
import { InvalidPasswordError } from '../../../domain/errors/values/password/InvalidPasswordError';
import { PasswordHasherInterface } from '../../services/password/PasswordHasherInterface';
import { UniqueIdGeneratorInterface } from '../../services/uid/UniqueIdGeneratorInterface';
import { RoleEnum } from '../../../domain/enums/RoleEnum';
import { InvalidRolesError } from '../../../domain/errors/entities/user/InvalidRolesError';    

export class CreateUserUsecase {
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
    roles?: RoleEnum[],
  ): Promise<User | EmailExistsError | InvalidEmailError | InvalidRolesError> {
    const maybeNewUser = User.from({
      firstName,
      lastName,
      email,
      password: this.passwordHasher.createHash(password),
      confirmationToken: this.uniqueIdGenerator.generate(),
      ...(roles ? { roles } : {})
    });

    if (
      maybeNewUser instanceof InvalidEmailError
      || maybeNewUser instanceof InvalidPasswordError
      || maybeNewUser instanceof InvalidRolesError
    ) {
      return maybeNewUser;
    }

    return await this.userRepository.create(maybeNewUser);
  }
}

