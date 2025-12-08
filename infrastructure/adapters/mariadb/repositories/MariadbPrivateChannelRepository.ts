import { Op } from "sequelize";
import { PrivateChannelRepositoryInterface, UpdatePrivateChannelPayload } from "../../../../application/repositories/PrivateChannelRepositoryInterface";
import { PrivateChannel } from "../../../../domain/entities/PrivateChannel";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { PrivateChannelModel } from "../models/PrivateChannelModel";
import { UserModel } from "../models/UserModel";
import { UserNotFoundError } from "../../../../domain/errors/entities/user/UserNotFoundError";

export class MariadbPrivateChannelRepository implements PrivateChannelRepositoryInterface {
  private privateChannelModel: PrivateChannelModel;
  private userModel: UserModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.privateChannelModel = new PrivateChannelModel(connection, this.userModel);
  }

  public async create(privateChannel: PrivateChannel): Promise<PrivateChannel | UserNotFoundError> {
    try {
      const createdPrivateChannel = await this.privateChannelModel.model.create({
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
      return new UserNotFoundError('User not found.');
    }
  }

  public async update(privateChannel: UpdatePrivateChannelPayload): Promise<PrivateChannel | ChannelNotFoundError> {
    try {
      const { id, ...toUpdate } = privateChannel;

      await this.privateChannelModel.model.update({
        ...toUpdate,
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      return new ChannelNotFoundError('Channel not found.');
    }
  }

  public async findAllByUser(userId: number): Promise<PrivateChannel[]> {
    try {
      const foundPrivateChannels = await this.privateChannelModel.model.findAll({
        where: {
          [Op.or]: [
            { userId },
          ],
        },
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
      const foundPrivateChannels = await this.privateChannelModel.model.findAll({
        where: {
          [Op.or]: [
            { userId: advisorId },
            { advisorId: advisorId },
            { advisorId: null },
          ],
        },
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

  public async findById(id: number): Promise<PrivateChannel | ChannelNotFoundError> {
    try {
      const foundPrivateChannel = await this.privateChannelModel.model.findByPk(id);
      if (!foundPrivateChannel) {
        return new ChannelNotFoundError('Channel not found.');
      }

      const maybePrivateChannel = PrivateChannel.from(foundPrivateChannel);

      return maybePrivateChannel;
    } catch (error) {
      return new ChannelNotFoundError('Channel not found');
    }
  }
}

