import { UserRepositoryInterface } from "../../../application/repositories/UserRepositoryInterface";
import { User } from "../../../domain/entities/User";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { EmailValue } from "../../../domain/values/EmailValue";

type MockUser = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  roles: RoleEnum[],
}

export class UserFixtures {
  public constructor(private repository: UserRepositoryInterface) {}

  public async load(): Promise<boolean | Error> {
    const users: MockUser[] = [
      {
        firstName: 'Avenir',
        lastName: 'User',
        email: 'user@avenir.com',
        password: 'azertyuiAZ123#',
        roles: [RoleEnum.USER],
      },
      {
        firstName: 'Avenir',
        lastName: 'Admin',
        email: 'admin@avenir.com',
        password: 'azertyuiAZ123#',
        roles: [RoleEnum.USER, RoleEnum.DIRECTOR],
      },
    ];

    await Promise.all(users.map((user) => this.createUser(user)));

    return true;
  }

  private async createUser(mockUser: MockUser): Promise<boolean | Error> {
    const maybeUser = User.from(mockUser);
    if (maybeUser instanceof Error) {
      return maybeUser;
    }

    const maybeError = await this.repository.create(maybeUser);
    if (maybeError instanceof Error) {
      return maybeError;
    }

    return true;
  }
}
