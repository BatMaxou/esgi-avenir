import { openConnection } from "../config/MongodbConnection";

export abstract class AbstractMongoRepository {
  protected initialized: boolean = false;

  public constructor(
    protected readonly databaseDsn: string,
    protected readonly databaseUser: string | undefined,
    protected readonly databasePassword: string | undefined,
    protected readonly databaseName: string | undefined
  ) {
    this.ensureConnection();
  }

  protected async ensureConnection(): Promise<void> {
    if (!this.initialized) {
      await openConnection(this.databaseDsn, this.databaseUser, this.databasePassword, this.databaseName);
      this.initialized = true;
    }
  }
}
