import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { User } from "../../../../domain/entities/User";
import { EmailExistsError } from "../../../../domain/errors/values/email/EmailExistsError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../../mariadb/config/MariadbConnection";
import { UserModel } from "../../mariadb/models/UserModel";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";

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
        password: user.password,
        email: user.email.value,
        roles: user.roles,
        enabled: user.enabled,
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
}
