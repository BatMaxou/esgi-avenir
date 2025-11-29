import { RepositoryInterface } from "./RepositoryInterface"
import { CompanyChannel } from "../../domain/entities/CompanyChannel"
import { ChannelNotFoundError } from "../../domain/errors/entities/channel/ChannelNotFoundError"

export type UpdateCompanyChannelPayload = Partial<CompanyChannel> & { id: number }

export interface CompanyChannelRepositoryInterface extends RepositoryInterface {
  create: (companyChannel: CompanyChannel) => Promise<CompanyChannel>
  update: (companyChannel: UpdateCompanyChannelPayload) => Promise<CompanyChannel | ChannelNotFoundError>
  findById: (id: number) => Promise<CompanyChannel | ChannelNotFoundError>
  findAll: () => Promise<CompanyChannel[]>
}
