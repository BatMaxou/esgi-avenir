import { Sequelize } from 'sequelize'

export class MariadbConnection {
  private connection: Sequelize;

  public constructor(mariadbDsn: string) {
    this.connection = new Sequelize(mariadbDsn);
  }

  public getConnection(): Sequelize {
    return this.connection;
  }
}
