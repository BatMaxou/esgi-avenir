
import { MariadbConnection } from '../../adapters/mariadb/config/MariadbConnection';
import { UserModel } from '../../adapters/mariadb/models/UserModel';
import { databaseDsn } from '../utils/tools';

const sync = async () => {
  try {
    const connection = new MariadbConnection(databaseDsn).getConnection();

    const userModel = new UserModel(connection);

    await connection.sync({ alter: true });

    console.log("✅ Database synced successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  }
};

sync();
