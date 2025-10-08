export const databaseUser = process.env.DB_USER || '';
export const databasePassword = process.env.DB_PASSWORD || '';
export const databaseHost = process.env.DB_HOST || '';
export const databaseName = process.env.DB_NAME || '';
export const databasePort = process.env.DB_PORT || '';
export const databaseUrl = `mysql://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}?serverVersion=12.0.2-MariaDB&charset=utf8mb4
`;
