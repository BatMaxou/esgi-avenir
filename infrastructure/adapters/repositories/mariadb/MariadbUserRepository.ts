import { UserRepositoryInterface } from "../../../../application/repositories/UserRepositoryInterface";
import { User } from "../../../../domain/entities/User";
import { EmailExistsError } from "../../../../domain/errors/EmailExistsError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../../mariadb/config/MariadbConnection";
import { UserModel } from "../../mariadb/models/UserModel";

export class MariadbUserRepository implements UserRepositoryInterface {
  private userModel: UserModel;

  public constructor() {
    this.userModel = new UserModel(new MariadbConnection(databaseDsn).getConnection());
  }

  public async create(user: User): Promise<User | EmailExistsError> {
    try {
      const createdUser = await this.userModel.model.create({
        email: user.email.value,
        roles: user.roles,
      });

      return User.from(createdUser.email) as User;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeUniqueConstraintError') {
        return new EmailExistsError(`The email ${user.email.value} already exists.`);
      }

      throw error;
    }
  }
}
