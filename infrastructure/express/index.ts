import express from "express";
import { openConnection } from "../adapters/mongodb/config/MongodbConnection";

const startServer = async () => {
  const app = express();

  await bootstrap();

  openConnection()
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
      process.exit(1);
    });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

const bootstrap = async () => {};

startServer().catch(console.error);
