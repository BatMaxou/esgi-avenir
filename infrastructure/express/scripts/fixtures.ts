import { PasswordHasher } from "../../adapters/bcrypt/services/PasswordHasher";
import { MariadbConnection } from "../../adapters/mariadb/config/MariadbConnection";
import { RepositoryResolver } from "../../adapters/services/RepositoryResolver";
import { bankCode, branchCode, databaseDsn, databaseSource } from "../utils/tools";
import { UserFixtures } from "../../../application/fixtures/UserFixtures";
import { AccountFixtures } from "../../../application/fixtures/AccountFixtures";
import { OperationFixtures } from "../../../application/fixtures/OperationFixtures";
import { initModels } from "../../adapters/mariadb/initModels";

const fixtures = async () => {
  try {
    const connection = new MariadbConnection(databaseDsn).getConnection();
    initModels(connection);

    console.log("🗑️ Dropping database...");
    await connection.drop();
    await connection.sync();

    const repositoryResolver = new RepositoryResolver(databaseSource);
    const passwordHasher = new PasswordHasher();

    await new UserFixtures(repositoryResolver.getUserRepository(), passwordHasher).load();
    await new AccountFixtures(repositoryResolver.getAccountRepository(), bankCode, branchCode).load();
    await new OperationFixtures(repositoryResolver.getOperationRepository()).load();

    console.log("✅ Fixtures loaded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error loading fixtures:", error);
    process.exit(1);
  }
};

fixtures();
