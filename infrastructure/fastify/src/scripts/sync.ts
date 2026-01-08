import { MariadbConnection } from '../../../adapters/mariadb/config/MariadbConnection';
import { databaseDsn } from '../utils/tools';
import { initModels } from '../../../adapters/mariadb/initModels';
import { openConnection } from '../../../adapters/mongodb/config/MongodbConnection';
import { databaseSource, databaseName, databasePassword, databaseUser } from '../utils/tools';

const sync = async () => {
  try {
    if (databaseSource === "mysql") {
      const connection = new MariadbConnection(databaseDsn).getConnection();
      initModels(connection);

      await connection.sync();
    } else if (databaseSource === "mongodb") {
      const mongoConnection = await openConnection(databaseDsn, databaseUser, databasePassword, databaseName);
    }

    console.log("✅ Database synced successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  }
};

sync();
