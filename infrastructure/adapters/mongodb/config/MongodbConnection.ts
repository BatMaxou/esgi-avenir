import { Mongoose, connect } from "mongoose";

export const openConnection = (
  databaseDsn: string | undefined,
  databaseUser: string | undefined,
  databasePassword: string | undefined,
  databaseName: string | undefined
): Promise<Mongoose> => {
  if (databaseDsn === undefined) {
    throw new Error("MONGO_URI is not defined");
  }

  if (databaseUser === undefined) {
    throw new Error("MONGO_USERNAME is not defined");
  }

  if (databasePassword === undefined) {
    throw new Error("MONGO_PASSWORD is not defined");
  }

  if (databaseName === undefined) {
    throw new Error("MONGO_DB_NAME is not defined");
  }

  return connect(databaseDsn, {
    auth: {
      username: databaseUser,
      password: databasePassword,
    },
    authSource: "admin",
    dbName: databaseName,
  });
};
