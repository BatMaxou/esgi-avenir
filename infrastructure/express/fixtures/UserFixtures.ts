import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { User } from "../../../domain/entities/User";

export class UserFixtures {
  public constructor(private repository: UserRepositoryInterface) {}

  public async load(): Promise<void> {
    const fixture = User.from('test@gmail.com');
    if (fixture instanceof Error) {
      throw fixture;
    }

    const maybeError = await this.repository.create(fixture);
    if (maybeError instanceof Error) {
      throw maybeError;
    }
  }
}
