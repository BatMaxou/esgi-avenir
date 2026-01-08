import { Message } from './Message';
import { ChannelInterface } from '../entities/interfaces/ChannelInterface';

export interface HydratedCompanyChannel extends CompanyChannel {
  messages: Message[];
}

export class CompanyChannel implements ChannelInterface {
  public id?: number;

  public static from({
    id,
    title,
  }: {
    id?: number,
    title: string,
  }): CompanyChannel {
    const companyChannel = new this(
      title,
    );

    if (id) {
      companyChannel.id = id;
    }

    return companyChannel;
  }

  private constructor(
    public title: string,
  ) {
  }
}
