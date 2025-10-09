import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

export const databaseUser = process.env.DB_USER || "";
export const databasePassword = process.env.DB_PASSWORD || "";
export const databaseHost = process.env.DB_HOST || "";
export const databaseName = process.env.DB_NAME || "";
export const databasePort = process.env.DB_PORT || "";
let databaseDsn: string | undefined;

switch (process.env.DB_SOURCE) {
  case "mongodb":
  case "mongo":
    databaseDsn = `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:27017/${databaseName}?authSource=admin`;
    break;
  case "mariadb":
  case "mysql":
    databaseDsn = `mysql://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?serverVersion=12.0.2-MariaDB&charset=utf8mb4`;
    break;
}

export { databaseDsn };
