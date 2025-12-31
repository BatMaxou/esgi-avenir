import {
  UpdateUserPayload,
  UserRepositoryInterface,
} from "../../../../application/repositories/UserRepositoryInterface";
import { User } from "../../../../domain/entities/User";
import { EmailExistsError } from "../../../../domain/errors/entities/user/EmailExistsError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { UserModel } from "../models/UserModel";
import { RoleEnum } from "../../../../domain/enums/RoleEnum";
import { getNextSequence } from "../models/CounterModel";
import { openConnection } from "../config/MongodbConnection";

export class MongodbUserRepository implements UserRepositoryInterface {
  private initialized: boolean = false;

  public constructor() {
    this.ensureConnection();
  }

  private async ensureConnection(): Promise<void> {
    if (!this.initialized) {
      await openConnection();
      this.initialized = true;
    }
  }

  public async create(user: User): Promise<User | EmailExistsError> {
    try {
      await this.ensureConnection();

      const existingUser = await UserModel.findOne({ email: user.email.value });
      if (existingUser) {
        return new EmailExistsError("Given email already exists.");
      }

      const nextId = await getNextSequence("user_id");

      const createdUser = await UserModel.create({
        id: nextId,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password.value,
        email: user.email.value,
        roles: user.roles,
        enabled: user.enabled,
        confirmationToken: user.confirmationToken,
        isDeleted: user.isDeleted,
      });

      const maybeUser = User.from({
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        password: createdUser.password,
        email: createdUser.email,
        roles: createdUser.roles,
        enabled: createdUser.enabled,
        confirmationToken: createdUser.confirmationToken,
        isDeleted: createdUser.isDeleted,
      });

      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      if (error instanceof Error && error.message.includes("E11000")) {
        return new EmailExistsError("Given email already exists.");
      }

      return new EmailExistsError("Given email already exists.");
    }
  }

  public async update(
    user: UpdateUserPayload
  ): Promise<User | UserNotFoundError | EmailExistsError> {
    try {
      await this.ensureConnection();

      const { id, email, password, roles, ...toUpdate } = user;

      if (roles && !roles.includes(RoleEnum.USER)) {
        roles.push(RoleEnum.USER);
      }

      if (email) {
        const existingUser = await UserModel.findOne({
          email: email.value,
          id: { $ne: id },
        });
        if (existingUser) {
          return new EmailExistsError("Given email already exists.");
        }
      }

      const updateData: any = {
        ...toUpdate,
        ...(email ? { email: email.value } : {}),
        ...(password ? { password: password.value } : {}),
        ...(roles ? { roles } : {}),
      };

      const updatedUser = await UserModel.findOneAndUpdate({ id }, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return new UserNotFoundError("User not found.");
      }

      return await this.findById(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes("E11000")) {
        return new EmailExistsError("Given email already exists.");
      }

      return new UserNotFoundError("User not found.");
    }
  }

  public async find(
    email: string,
    password: string
  ): Promise<User | UserNotFoundError> {
    try {
      await this.ensureConnection();

      const foundUser = await UserModel.findOne({ email, password });
      if (!foundUser) {
        return new UserNotFoundError("User not found.");
      }

      const maybeUser = User.from({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        password: foundUser.password,
        email: foundUser.email,
        roles: foundUser.roles,
        enabled: foundUser.enabled,
        confirmationToken: foundUser.confirmationToken,
        isDeleted: foundUser.isDeleted,
      });

      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      await this.ensureConnection();

      const foundUsers = await UserModel.find();
      const users: User[] = [];

      foundUsers.forEach((foundUser) => {
        const maybeUser = User.from({
          id: foundUser.id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          password: foundUser.password,
          email: foundUser.email,
          roles: foundUser.roles,
          enabled: foundUser.enabled,
          confirmationToken: foundUser.confirmationToken,
          isDeleted: foundUser.isDeleted,
        });

        if (maybeUser instanceof Error) {
          throw maybeUser;
        }

        users.push(maybeUser);
      });

      return users;
    } catch (error) {
      return [];
    }
  }

  public async findByEmail(email: string): Promise<User | UserNotFoundError> {
    try {
      await this.ensureConnection();

      const foundUser = await UserModel.findOne({ email });
      if (!foundUser) {
        return new UserNotFoundError("User not found.");
      }

      const maybeUser = User.from({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        password: foundUser.password,
        email: foundUser.email,
        roles: foundUser.roles,
        enabled: foundUser.enabled,
        confirmationToken: foundUser.confirmationToken,
        isDeleted: foundUser.isDeleted,
      });

      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findById(id: number): Promise<User | UserNotFoundError> {
    try {
      await this.ensureConnection();

      const foundUser = await UserModel.findOne({ id });
      if (!foundUser) {
        return new UserNotFoundError("User not found.");
      }

      const maybeUser = User.from({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        password: foundUser.password,
        email: foundUser.email,
        roles: foundUser.roles,
        enabled: foundUser.enabled,
        confirmationToken: foundUser.confirmationToken,
        isDeleted: foundUser.isDeleted,
      });

      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findByConfirmationToken(
    token: string
  ): Promise<User | UserNotFoundError> {
    try {
      await this.ensureConnection();

      const foundUser = await UserModel.findOne({ confirmationToken: token });
      if (!foundUser) {
        return new UserNotFoundError("Invalid token.");
      }

      const maybeUser = User.from({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        password: foundUser.password,
        email: foundUser.email,
        roles: foundUser.roles,
        enabled: foundUser.enabled,
        confirmationToken: foundUser.confirmationToken,
        isDeleted: foundUser.isDeleted,
      });

      if (maybeUser instanceof Error) {
        throw maybeUser;
      }

      return maybeUser;
    } catch (error) {
      return new UserNotFoundError("Invalid token.");
    }
  }

  public async delete(id: number): Promise<boolean | UserNotFoundError> {
    try {
      await this.ensureConnection();

      const deletedUser = await UserModel.findOneAndDelete({ id });
      if (!deletedUser) {
        return new UserNotFoundError("User not found.");
      }

      return true;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findByIds(ids: number[]): Promise<User[]> {
    try {
      await this.ensureConnection();

      const foundUsers = await UserModel.find({ id: { $in: ids } });
      const users: User[] = [];

      foundUsers.forEach((foundUser) => {
        const maybeUser = User.from({
          id: foundUser.id,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          password: foundUser.password,
          email: foundUser.email,
          roles: foundUser.roles,
          enabled: foundUser.enabled,
          confirmationToken: foundUser.confirmationToken,
          isDeleted: foundUser.isDeleted,
        });

        if (maybeUser instanceof Error) {
          throw maybeUser;
        }

        users.push(maybeUser);
      });

      return users;
    } catch (error) {
      return [];
    }
  }
}
