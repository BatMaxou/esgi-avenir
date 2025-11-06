export class InvalidRolesError extends Error {
  public constructor(message: string) {
    super(message);

    this.name = 'InvalidRolesError';
  }
}

