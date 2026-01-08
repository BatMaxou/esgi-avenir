import { MessageRepositoryInterface } from "../../../../application/repositories/MessageRepositoryInterface";
import { Message } from "../../../../domain/entities/Message";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { PrivateMessageModel } from "../models/PrivateMessageModel";
import { CompanyMessageModel } from "../models/CompanyMessageModel";
import { UserModel } from "../models/UserModel";
import { PrivateChannelModel } from "../models/PrivateChannelModel";
import { CompanyChannelModel } from "../models/CompanyChannelModel";
import { getNextSequence } from "../models/CounterModel";
import { AbstractMongoRepository } from "./AbstractMongoRepository";

export class MongodbMessageRepository extends AbstractMongoRepository implements MessageRepositoryInterface {
  public async createPrivate(
    message: Message
  ): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    try {
      await this.ensureConnection();

      // Validate user
      if (message.userId) {
        const user = await UserModel.findOne({ id: message.userId });
        if (!user) {
          return new UserNotFoundError("User not found.");
        }
      }

      // Validate channel
      if (message.channelId) {
        const channel = await PrivateChannelModel.findOne({
          id: message.channelId,
        });
        if (!channel) {
          return new ChannelNotFoundError("Channel not found.");
        }
      }

      const messageId = await getNextSequence("private_message_id");

      const createdMessage = await PrivateMessageModel.create({
        id: messageId,
        content: message.content,
        userId: message.userId,
        channelId: message.channelId,
        createdAt: new Date(),
      });

      const maybeMessage = Message.from(createdMessage);
      if (maybeMessage instanceof Error) {
        throw maybeMessage;
      }

      return maybeMessage;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async createCompany(
    message: Message
  ): Promise<Message | UserNotFoundError | ChannelNotFoundError> {
    try {
      await this.ensureConnection();

      // Validate user
      if (message.userId) {
        const user = await UserModel.findOne({ id: message.userId });
        if (!user) {
          return new UserNotFoundError("User not found.");
        }
      }

      // Validate channel
      if (message.channelId) {
        const channel = await CompanyChannelModel.findOne({
          id: message.channelId,
        });
        if (!channel) {
          return new ChannelNotFoundError("Channel not found.");
        }
      }

      const messageId = await getNextSequence("company_message_id");

      const createdMessage = await CompanyMessageModel.create({
        id: messageId,
        content: message.content,
        userId: message.userId,
        channelId: message.channelId,
        createdAt: new Date(),
      });

      const maybeMessage = Message.from(createdMessage);
      if (maybeMessage instanceof Error) {
        throw maybeMessage;
      }

      return maybeMessage;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async findByPrivateChannel(channelId: number): Promise<Message[]> {
    try {
      await this.ensureConnection();

      const foundMessages = await PrivateMessageModel.find({
        channelId,
      }).sort({ createdAt: -1 });

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
      await this.ensureConnection();

      const foundMessages = await CompanyMessageModel.find({
        channelId,
      }).sort({ createdAt: -1 });

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
