import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { User } from "../../../../domain/entities/User";
import { EmailExistsError } from "../../../../domain/errors/values/email/EmailExistsError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../../mariadb/config/MariadbConnection";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { UserModel } from "../../mariadb/models/UserModel";

export class MariadbUserRepository implements UserRepositoryInterface {
  private userModel: UserModel;

  public constructor() {
    this.userModel = new UserModel(new MariadbConnection(databaseDsn).getConnection());
  }

  public async create(user: User): Promise<User | EmailExistsError> {
    try {
      const createdUser = await this.userModel.model.create({
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password.value,
        email: user.email.value,
        roles: user.roles,
        enabled: user.enabled,
        confirmationToken: user.confirmationToken,
      });

      const maybeUser = User.from(createdUser);
      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        return new EmailExistsError(`The email ${user.email.value} already exists.`);
      }

      throw error;
    }
  }

  public async update(user: Partial<User> & { id: number }): Promise<User> {
    try {
      const { id, email, password, ...toUpdate } = user;

      await this.userModel.model.update({
        ...toUpdate,
        ...(email ? { email: email.value } : {}),
        ...(password ? { password: password.value } : {}),
      }, {
        where: { id },
      });

      const maybeUpdatedUserRecord = await this.userModel.model.findByPk(id);
      if (!maybeUpdatedUserRecord) {
        throw new UserNotFoundError('User not found.');
      }

      const maybeUser = User.from(maybeUpdatedUserRecord);
      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      console.error(error);

      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        throw new EmailExistsError(`The email ${user.email?.value} already exists.`);
      }

      throw new UserNotFoundError('User not found.');
    }
  }

  public async find(email: string, password: string): Promise<User | UserNotFoundError> {
    try {
      const foundUser = await this.userModel.model.findOne({ where: { email, password } });
      if (!foundUser) {
        return new UserNotFoundError(`User with email ${email} not found.`);
      }

      const maybeUser = User.from(foundUser);
      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      throw new UserNotFoundError(`User with email ${email} not found.`);
    }
  }

  public async findByEmail(email: string): Promise<User | UserNotFoundError> {
    try {
      const foundUser = await this.userModel.model.findOne({ where: { email } });
      if (!foundUser) {
        return new UserNotFoundError(`User with email ${email} not found.`);
      }

      const maybeUser = User.from(foundUser);
      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      throw new UserNotFoundError(`User with email ${email} not found.`);
    }
  }

  public async findById(id: number): Promise<User | UserNotFoundError> {
    try {
      const foundUser = await this.userModel.model.findByPk(id);
      if (!foundUser) {
        return new UserNotFoundError(`User with id ${id} not found.`);
      }

      const maybeUser = User.from(foundUser);
      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      throw new UserNotFoundError(`User with id ${id} not found.`);
    }
  }

  public async findByConfirmationToken(token: string): Promise<User | UserNotFoundError> {
    try {
      const foundUser = await this.userModel.model.findOne({ where: { confirmationToken: token } });
      if (!foundUser) {
        return new UserNotFoundError('Invalid token.');
      }

      const maybeUser = User.from(foundUser);
      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      throw new UserNotFoundError('Invalid token.');
    }
  }
}
