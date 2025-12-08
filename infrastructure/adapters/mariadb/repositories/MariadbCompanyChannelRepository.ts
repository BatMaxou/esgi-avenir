import { CompanyChannelRepositoryInterface, UpdateCompanyChannelPayload } from "../../../../application/repositories/CompanyChannelRepositoryInterface";
import { CompanyChannel } from "../../../../domain/entities/CompanyChannel";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { databaseDsn } from "../../../express/utils/tools";
import { MariadbConnection } from "../config/MariadbConnection";
import { CompanyChannelModel } from "../models/CompanyChannelModel";
import { UserModel } from "../models/UserModel";

export class MariadbCompanyChannelRepository implements CompanyChannelRepositoryInterface {
  private companyChannelModel: CompanyChannelModel;
  private userModel: UserModel;

  public constructor() {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    this.userModel = new UserModel(connection);
    this.companyChannelModel = new CompanyChannelModel(connection, this.userModel);
  }

  public async create(companyChannel: CompanyChannel): Promise<CompanyChannel> {
    const createdCompanyChannel = await this.companyChannelModel.model.create({
      title: companyChannel.title,
    });

    const maybeCompanyChannel = CompanyChannel.from(createdCompanyChannel);

    return maybeCompanyChannel;
  }

  public async update(companyChannel: UpdateCompanyChannelPayload): Promise<CompanyChannel | ChannelNotFoundError> {
    try {
      const { id, ...toUpdate } = companyChannel;

      await this.companyChannelModel.model.update({
        ...toUpdate,
      }, {
        where: { id },
      });

      return await this.findById(id);
    } catch (error) {
      return new ChannelNotFoundError('Channel not found.');
    }
  }

  public async findAll(): Promise<CompanyChannel[]> {
    return await this.companyChannelModel.model.findAll();
  }

  public async findById(id: number): Promise<CompanyChannel | ChannelNotFoundError> {
    try {
      const foundCompanyChannel = await this.companyChannelModel.model.findByPk(id);
      if (!foundCompanyChannel) {
        return new ChannelNotFoundError('Channel not found.');
      }

      const maybeCompanyChannel = CompanyChannel.from(foundCompanyChannel);

      return maybeCompanyChannel;
    } catch (error) {
      return new ChannelNotFoundError('Channel not found.');
    }
  }
}

