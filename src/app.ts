import express from "express";
import cors from "cors";

import signUpRouter from "./routes/signUpRouter";
import loginRouter from "./routes/userRouter";
import { AppDataSource } from "./connection/dataSource";

(async function () {
  await AppDataSource.initialize();

  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  app.use("/signUp", signUpRouter);
  app.use("/user", loginRouter);

  app.listen(3001, () => {
    console.log("server is running");
  });
})();
