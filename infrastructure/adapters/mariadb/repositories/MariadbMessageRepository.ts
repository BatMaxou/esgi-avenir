import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { MariadbConnection } from "../config/MariadbConnection";
import { UserModel } from "../models/UserModel";
import { PrivateMessageModel } from "../models/PrivateMessageModel";
import { CompanyMessageModel } from "../models/CompanyMessageModel";
import { PrivateChannelModel } from "../models/PrivateChannelModel";
import { CompanyChannelModel } from "../models/CompanyChannelModel";
import { Message } from "../../../../domain/entities/Message";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { MessageRepositoryInterface } from "../../../../application/repositories/MessageRepositoryInterface";

export class MariadbMessageRepository implements MessageRepositoryInterface {
  private userModel: UserModel;
  private privateMessageModel: PrivateMessageModel;
  private companyMessageModel: CompanyMessageModel;

  public constructor(databaseDsn: string) {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.privateMessageModel = new PrivateMessageModel(connection, this.userModel, new PrivateChannelModel(connection, this.userModel));
    this.companyMessageModel = new CompanyMessageModel(connection, this.userModel, new CompanyChannelModel(connection, this.userModel));
  }

  public async createPrivate(message: Message): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    try {
      const createdMessage = await this.privateMessageModel.model.create({
        content: message.content,
        userId: message.userId,
        channelId: message.channelId,
      });

      const maybeMessage = Message.from({ ...message, ...createdMessage.dataValues});
      if (maybeMessage instanceof Error) {
        throw maybeMessage;
      }

      return maybeMessage;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('userId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('channelId')) {
          return new ChannelNotFoundError('Channel not found.');
        }
      }

      return new UserNotFoundError('User not found.');
    }
  }

  public async createCompany(message: Message): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    try {
      const createdMessage = await this.companyMessageModel.model.create({
        content: message.content,
        userId: message.userId,
        channelId: message.channelId,
      });

      const maybeMessage = Message.from({ ...message, ...createdMessage.dataValues});
      if (maybeMessage instanceof Error) {
        throw maybeMessage;
      }

      return maybeMessage;
    } catch (error) {
      if (error instanceof Error && error.name === 'SequelizeForeignKeyConstraintError') {
        if (error.message.includes('userId')) {
          return new UserNotFoundError('User not found.');
        } else if (error.message.includes('channelId')) {
          return new ChannelNotFoundError('Channel not found.');
        }
      }

      return new UserNotFoundError('User not found.');
    }
  }

  public async findByPrivateChannel(channelId: number): Promise<Message[]> {
    try {
      const foundMessages = await this.privateMessageModel.model.findAll({
        where: {
          channelId,
        },
        include: [
          {
            model: this.userModel.model,
            as: 'user',
          }
        ],
        order: [['createdAt', 'DESC']],
      });

      const messages: Message[] = [];

      foundMessages.forEach((foundMessage) => {
        const maybeMessage = Message.from(foundMessage);
        if (maybeMessage instanceof Error) {
          throw maybeMessage;
        }

        messages.push(maybeMessage);
      });

      return messages;
    } catch (error) {
      return [];
    }
  }

  public async findByCompanyChannel(channelId: number): Promise<Message[]> {
    try {
      const foundMessages = await this.companyMessageModel.model.findAll({
        where: {
          channelId,
        },
        include: [
          {
            model: this.userModel.model,
            as: 'user',
          }
        ],
        order: [['createdAt', 'DESC']],
      });

      const messages: Message[] = [];

      foundMessages.forEach((foundMessage) => {
        const maybeMessage = Message.from(foundMessage);
        if (maybeMessage instanceof Error) {
          throw maybeMessage;
        }

        messages.push(maybeMessage);
      });

      return messages;
    } catch (error) {
      return [];
    }
  }
}
