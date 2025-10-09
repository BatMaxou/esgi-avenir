import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const generateDatabaseDsnOptions = (): string => {
  switch (databaseSource) {
    case 'mongodb':
      return `?authSource=admin`;
    default:
      return '';
  }
}

export const databaseUser: string = process.env.DB_USER || '';
export const databasePassword: string = process.env.DB_PASSWORD || '';
export const databaseHost: string = process.env.DB_HOST || '';
export const databaseName: string = process.env.DB_NAME || '';
export const databasePort: string = process.env.DB_PORT || '';
export const databaseSource: string = process.env.DB_SOURCE || 'mysql';
export const databaseDsn: string = `${databaseSource}://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?${generateDatabaseDsnOptions()}`;

