export class InvalidDurationInMonthsError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidDurationInMonthsError';
  }
}
