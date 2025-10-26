import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../domain/errors/entities/user/UserNotFoundError';
import { EmailValue } from '../../../domain/values/EmailValue';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class MeUsecase {
  public constructor(private readonly userRepository: UserRepositoryInterface) {}

  public async execute(id: number): Promise<User | UserNotFoundError> {
    return await this.userRepository.findById(id);
  }
}

