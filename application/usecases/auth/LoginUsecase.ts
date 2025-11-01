import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class LoginUsecase {
  public constructor(private readonly userRepository: UserRepositoryInterface) {}

  public async execute(email: string, password: string): Promise<User | UserNotFoundError> {
    return await this.userRepository.find(email, password);
  }
}

