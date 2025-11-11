import { MariadbConnection } from '../../adapters/mariadb/config/MariadbConnection';
import { databaseDsn } from '../utils/tools';
import { initModels } from '../../adapters/mariadb/initModels';

const sync = async () => {
  try {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    initModels(connection);

    console.log("🔄 Syncing database...");
    await connection.sync();

    console.log("✅ Database synced successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing database:", error);
    process.exit(1);
  }
};

sync();
