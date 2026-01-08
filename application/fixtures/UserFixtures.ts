import { User } from '../../domain/entities/User';
import { RoleEnum } from '../../domain/enums/RoleEnum';
import { UserRepositoryInterface } from '../repositories/UserRepositoryInterface';
import { PasswordHasherInterface } from '../services/password/PasswordHasherInterface';

type MockUser = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  roles: RoleEnum[],
  enabled: boolean,
}

export class UserFixtures {
  public constructor(
    private readonly repository: UserRepositoryInterface,
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async load(): Promise<boolean | Error> {
    const users: MockUser[] = [
      {
        firstName: 'Avenir',
        lastName: 'Director',
        email: 'director@avenir.com',
        password: this.passwordHasher.createHash('azertyuiAZ123#'),
        roles: [RoleEnum.USER, RoleEnum.DIRECTOR],
        enabled: true,
      },
      {
        firstName: 'Avenir',
        lastName: 'User',
        email: 'user@avenir.com',
        password: this.passwordHasher.createHash('azertyuiAZ123#'),
        roles: [RoleEnum.USER],
        enabled: true,
      },
      {
        firstName: 'Avenir',
        lastName: 'Second User',
        email: 'second.user@avenir.com',
        password: this.passwordHasher.createHash('azertyuiAZ123#'),
        roles: [RoleEnum.USER],
        enabled: true,
      },
      {
        firstName: 'Avenir',
        lastName: 'Third User',
        email: 'third.user@avenir.com',
        password: this.passwordHasher.createHash('azertyuiAZ123#'),
        roles: [RoleEnum.USER],
        enabled: true,
      },
      {
        firstName: 'Avenir',
        lastName: 'Advisor',
        email: 'advisor@avenir.com',
        password: this.passwordHasher.createHash('azertyuiAZ123#'),
        roles: [RoleEnum.USER, RoleEnum.ADVISOR],
        enabled: true,
      },
      {
        firstName: 'Avenir',
        lastName: 'Second Advisor',
        email: 'second.advisor@avenir.com',
        password: this.passwordHasher.createHash('azertyuiAZ123#'),
        roles: [RoleEnum.USER, RoleEnum.ADVISOR],
        enabled: true,
      },
    ];

    for (const user of users) {
      await this.createUser(user);
    }

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
