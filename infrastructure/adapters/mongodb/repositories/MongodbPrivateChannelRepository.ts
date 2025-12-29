import {
  PrivateChannelRepositoryInterface,
  UpdatePrivateChannelPayload,
} from "../../../../application/repositories/PrivateChannelRepositoryInterface";
import { PrivateChannel } from "../../../../domain/entities/PrivateChannel";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";
import { openConnection } from "../config/MongodbConnection";
import { PrivateChannelModel } from "../models/PrivateChannelModel";
import { UserModel } from "../models/UserModel";
import { getNextSequence } from "../models/CounterModel";

export class MongodbPrivateChannelRepository
  implements PrivateChannelRepositoryInterface
{
  private async ensureConnection(): Promise<void> {
    await openConnection();
  }

  public async create(
    privateChannel: PrivateChannel
  ): Promise<PrivateChannel | UserNotFoundError> {
    try {
      await this.ensureConnection();

      // Validate user
      if (privateChannel.userId) {
        const user = await UserModel.findOne({ id: privateChannel.userId });
        if (!user) {
          return new UserNotFoundError("User not found.");
        }
      }

      // Validate advisor if provided
      if (privateChannel.advisorId) {
        const advisor = await UserModel.findOne({
          id: privateChannel.advisorId,
        });
        if (!advisor) {
          return new UserNotFoundError("User not found.");
        }
      }

      const privateChannelId = await getNextSequence("private_channel_id");

      const createdPrivateChannel = await PrivateChannelModel.create({
        id: privateChannelId,
        title: privateChannel.title,
        userId: privateChannel.userId,
        advisorId: privateChannel.advisorId,
      });

      const maybePrivateChannel = PrivateChannel.from(createdPrivateChannel);
      if (maybePrivateChannel instanceof Error) {
        throw maybePrivateChannel;
      }

      return maybePrivateChannel;
    } catch (error) {
      return new UserNotFoundError("User not found.");
    }
  }

  public async update(
    privateChannel: UpdatePrivateChannelPayload
  ): Promise<PrivateChannel | ChannelNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, ...toUpdate } = privateChannel;

      const updatedPrivateChannel = await PrivateChannelModel.findOneAndUpdate(
        { id },
        toUpdate,
        { new: true }
      );

      if (!updatedPrivateChannel) {
        return new ChannelNotFoundError("Channel not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new ChannelNotFoundError("Channel not found.");
    }
  }

  public async findAllByUser(userId: number): Promise<PrivateChannel[]> {
    try {
      await this.ensureConnection();

      const foundPrivateChannels = await PrivateChannelModel.find({
        userId,
      });

      const privateChannels: PrivateChannel[] = [];

      foundPrivateChannels.forEach((foundPrivateChannel) => {
        const maybePrivateChannel = PrivateChannel.from(foundPrivateChannel);
        if (maybePrivateChannel instanceof Error) {
          throw maybePrivateChannel;
        }

        privateChannels.push(maybePrivateChannel);
      });

      return privateChannels;
    } catch (error) {
      return [];
    }
  }

  public async findAllByAdvisor(advisorId: number): Promise<PrivateChannel[]> {
    try {
      await this.ensureConnection();

      const foundPrivateChannels = await PrivateChannelModel.find({
        $or: [
          { userId: advisorId },
          { advisorId: advisorId },
          { advisorId: null },
        ],
      });

      const privateChannels: PrivateChannel[] = [];

      foundPrivateChannels.forEach((foundPrivateChannel) => {
        const maybePrivateChannel = PrivateChannel.from(foundPrivateChannel);
        if (maybePrivateChannel instanceof Error) {
          throw maybePrivateChannel;
        }

        privateChannels.push(maybePrivateChannel);
      });

      return privateChannels;
    } catch (error) {
      return [];
    }
  }

  public async findById(
    id: number
  ): Promise<PrivateChannel | ChannelNotFoundError> {
    try {
      await this.ensureConnection();

      const foundPrivateChannel = await PrivateChannelModel.findOne({ id });

      if (!foundPrivateChannel) {
        return new ChannelNotFoundError("Channel not found.");
      }

      const maybePrivateChannel = PrivateChannel.from(foundPrivateChannel);

      return maybePrivateChannel;
    } catch (error) {
      return new ChannelNotFoundError("Channel not found");
    }
  }
}
