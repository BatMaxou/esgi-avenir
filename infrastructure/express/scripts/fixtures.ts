import { PasswordHasher } from "../../adapters/bcrypt/services/PasswordHasher";
import { MariadbConnection } from "../../adapters/mariadb/config/MariadbConnection";
import { RepositoryResolver } from "../../adapters/services/RepositoryResolver";
import { bankCode, branchCode, databaseDsn, databaseSource } from "../utils/tools";
import { UserFixtures } from "../../../application/fixtures/UserFixtures";
import { AccountFixtures } from "../../../application/fixtures/AccountFixtures";
import { OperationFixtures } from "../../../application/fixtures/OperationFixtures";
import { SettingFixtures } from "../../../application/fixtures/SettingFixtures";
import { StockFixtures } from "../../../application/fixtures/StockFixtures";
import { StockOrderFixtures } from "../../../application/fixtures/StockOrderFixtures";
import { FinancialSecurityFixtures } from "../../../application/fixtures/FinancialSecurityFixtures";
import { BeneficiaryFixtures } from "../../../application/fixtures/BeneficiaryFixtures";
import { BankCreditFixtures } from "../../../application/fixtures/BankCreditFixtures";
import { MonthlyPaymentFixtures } from "../../../application/fixtures/MonthlyPaymentFixtures";
import { NewsFixtures } from "../../../application/fixtures/NewsFixtures";
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

    await Promise.all([
      await new UserFixtures(repositoryResolver.getUserRepository(), passwordHasher).load(),
      await new SettingFixtures(repositoryResolver.getSettingRepository()).load(),
      await new StockFixtures(repositoryResolver.getStockRepository()).load(),
    ]);

    await Promise.all([
      await new AccountFixtures(repositoryResolver.getAccountRepository(), bankCode, branchCode).load(),
      await new StockOrderFixtures(repositoryResolver.getStockOrderRepository()).load(),
      await new FinancialSecurityFixtures(repositoryResolver.getFinancialSecurityRepository()).load(),
      await new NewsFixtures(repositoryResolver.getNewsRepository()).load(),
    ]);

    await Promise.all([
      await new OperationFixtures(repositoryResolver.getOperationRepository()).load(),
      await new BeneficiaryFixtures(repositoryResolver.getBeneficiaryRepository()).load(),
      await new BankCreditFixtures(repositoryResolver.getBankCreditRepository()).load(),
    ]);

    await Promise.all([
      await new MonthlyPaymentFixtures(repositoryResolver.getMonthlyPaymentRepository()).load(),
    ]);

    console.log("✅ Fixtures loaded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error loading fixtures:", error);
    process.exit(1);
  }
};

fixtures();
