import {
  CompanyChannelRepositoryInterface,
  UpdateCompanyChannelPayload,
} from "../../../../application/repositories/CompanyChannelRepositoryInterface";
import { CompanyChannel } from "../../../../domain/entities/CompanyChannel";
import { ChannelNotFoundError } from "../../../../domain/errors/entities/channel/ChannelNotFoundError";
import { openConnection } from "../config/MongodbConnection";
import { CompanyChannelModel } from "../models/CompanyChannelModel";
import { getNextSequence } from "../models/CounterModel";

export class MongodbCompanyChannelRepository
  implements CompanyChannelRepositoryInterface
{
  private async ensureConnection(): Promise<void> {
    await openConnection();
  }

  public async create(companyChannel: CompanyChannel): Promise<CompanyChannel> {
    await this.ensureConnection();

    const companyChannelId = await getNextSequence("company_channel_id");

    const createdCompanyChannel = await CompanyChannelModel.create({
      id: companyChannelId,
      title: companyChannel.title,
    });

    const maybeCompanyChannel = CompanyChannel.from(createdCompanyChannel);

    return maybeCompanyChannel;
  }

  public async update(
    companyChannel: UpdateCompanyChannelPayload
  ): Promise<CompanyChannel | ChannelNotFoundError> {
    try {
      await this.ensureConnection();

      const { id, ...toUpdate } = companyChannel;

      const updatedCompanyChannel = await CompanyChannelModel.findOneAndUpdate(
        { id },
        toUpdate,
        { new: true }
      );

      if (!updatedCompanyChannel) {
        return new ChannelNotFoundError("Channel not found.");
      }

      return await this.findById(id);
    } catch (error) {
      return new ChannelNotFoundError("Channel not found.");
    }
  }

  public async findAll(): Promise<CompanyChannel[]> {
    await this.ensureConnection();

    return await CompanyChannelModel.find();
  }

  public async findById(
    id: number
  ): Promise<CompanyChannel | ChannelNotFoundError> {
    try {
      await this.ensureConnection();

      const foundCompanyChannel = await CompanyChannelModel.findOne({ id });

      if (!foundCompanyChannel) {
        return new ChannelNotFoundError("Channel not found.");
      }

      const maybeCompanyChannel = CompanyChannel.from(foundCompanyChannel);

      return maybeCompanyChannel;
    } catch (error) {
      return new ChannelNotFoundError("Channel not found.");
    }
  }
}
