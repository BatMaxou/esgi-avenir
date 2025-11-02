export class UserNotEnabledError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'UserNotEnabledError';
  }
}
