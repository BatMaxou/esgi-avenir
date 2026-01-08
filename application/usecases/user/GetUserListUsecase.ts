import { User } from '../../../domain/entities/User';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';

export class GetUserListUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}

