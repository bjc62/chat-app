import express from "express";
import cors from "cors";

import signUpRouter from "./routes/signUpRouter";
import loginRouter from "./routes/userRouter";
import { AppDataSource } from "./connection/dataSource";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import historicalMessageRouter from "./routes/historicalMessageRouter";
import { User } from "./entity/User";
import ChatHistory from "./entity/ChatHistory";
import chatHistoryRouter from "./routes/chatHistoryRouter";
import registerEvent from "./eventListeners/register";
import privateMessageEvent from "./eventListeners/private_message";

const userSocketMap = new Map<string, string>();

(async function () {
  const userRepository = AppDataSource.getRepository(User);
  const chatHistoryRepository = AppDataSource.getRepository(ChatHistory);

  const webSocketApp = express();
  const httpServer = createServer(webSocketApp);
  const webSocketServer = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  webSocketServer.on("connect", (socket: Socket) => {
    registerEvent(socket);
    privateMessageEvent(socket);

    socket.on("disconnect", () => {
      console.log("user disconnected");
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
        }
      }
    });
  });

  httpServer.listen(3002, () => {
    console.log("WebSocket server listening on 3002 port");
  });

  await AppDataSource.initialize();

  const apiApp = express();

  apiApp.use(express.json());
  apiApp.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  apiApp.use("/signUp", signUpRouter);
  apiApp.use("/user", loginRouter);
  apiApp.use("/historicalMessage", historicalMessageRouter);
  apiApp.use("/chatHistory", chatHistoryRouter);

  apiApp.get("/test1", (req, res) => {
    setTimeout(() => {
      res.send("test1 finished");
    }, 10000);
  });
  apiApp.get("/test2", async (req, res) => {
    const promise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("promise resolved");
      }, 10000);
    });
    await promise;
    res.send("test2 finished");
  });

  apiApp.listen(3001, () => {
    console.log("API server is running on 3001 port");
  });
})();
