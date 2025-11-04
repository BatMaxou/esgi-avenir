import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { EmailExistsError } from '../../../domain/errors/values/email/EmailExistsError';
import { InvalidEmailError } from '../../../domain/errors/values/email/InvalidEmailError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class RegisterUsecase {
  public constructor(private readonly userRepository: UserRepositoryInterface) {}

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
      password,
    });

    if (maybeNewUser instanceof InvalidEmailError) {
      return maybeNewUser;
    }

    return await this.userRepository.create(maybeNewUser);
  }
}

