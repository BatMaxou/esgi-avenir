import { MariadbConnection } from "../../adapters/mariadb/config/MariadbConnection";
import { RepositoryResolver } from "../../adapters/services/RepositoryResolver";
import { UserFixtures } from "../fixtures/UserFixtures";
import { initModels } from "../utils/initModel";
import { databaseDsn, databaseSource } from "../utils/tools";

const fixtures = async () => {
  try {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    initModels(connection);

    console.log("🗑️ Dropping database...");
    await connection.drop();
    await connection.sync();

    const repositoryResolver = new RepositoryResolver(databaseSource);
    const fixtures = [
      new UserFixtures(repositoryResolver.getUserRepository()),
    ];

    await Promise.all(fixtures.map((fixture) => fixture.load()))
      .then(() => {
        console.log("✅ Fixtures loaded successfully.");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Error loading fixtures:", error);
        process.exit(1);
      });
  } catch (error) {
    console.error("❌ Error dropping database:", error);
    process.exit(1);
  }
};

fixtures();
