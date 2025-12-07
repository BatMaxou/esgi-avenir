import { User } from '../../../domain/entities/User';
import { UserRepositoryInterface } from '../../repositories/UserRepositoryInterface';
import { TokenManagerInterface } from '../../services/token/TokenManagerInterface';
import { UnauthorizedError } from '../../errors/middlewares/UnauthorizedError';

export class AuthMiddlewareUsecase {
  public constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly tokenManager: TokenManagerInterface,
  ) {}

  public async execute(
    authHeader?: string,
  ): Promise<User | UnauthorizedError> {
    if (!authHeader) {
      return new UnauthorizedError();
    }

    const split = authHeader.split(" ");
    if (split.length < 2) {
      return new UnauthorizedError();
    }

    const [method, token, ..._] = split;
    if (method !== 'Bearer') {
      return new UnauthorizedError();
    }

    const decoded = this.tokenManager.verify(token);
    if (!decoded || !decoded.id) {
      return new UnauthorizedError();
    }

    const maybeUser = await this.userRepository.findById(decoded.id);
    if (maybeUser instanceof Error) {
      return new UnauthorizedError();
    }

    return maybeUser;
  }
}

