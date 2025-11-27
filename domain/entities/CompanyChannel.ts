import { ChannelInterface } from '../interfaces/ChannelInterface';

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
