import express from "express";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: '.env.local', override: true })

const startServer = async () => {
  const app = express();

  await bootstrap();
  
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(3000, () => console.log(`Listening on port 3000`));
};

const bootstrap = async () => {
};

startServer().catch(console.error);
