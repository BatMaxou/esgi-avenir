import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { EmailExistsError } from '../../../domain/errors/values/email/EmailExistsError';
import { InvalidEmailError } from '../../../domain/errors/values/email/InvalidEmailError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';
import { MailerInterface } from '../../services/email/MailerInterface';

export class ConfirmAccountUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(
    token: string,
  ): Promise<User | UserNotFoundError | EmailExistsError> {
    const maybeUser = await this.userRepository.findByConfirmationToken(token);
    if (maybeUser instanceof UserNotFoundError) {
      return maybeUser;
    }

    const updatedUser = await this.userRepository.update({
      id: maybeUser.id!,
      enabled: true,
      confirmationToken: null,
    });

    return updatedUser;
  }
}

