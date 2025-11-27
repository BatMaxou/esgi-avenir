export class ChannelNotFoundError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'ChannelNotFoundError';
  }
}
