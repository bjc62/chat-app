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

const port = process.env.PORT || 3001;

(async function () {
  const userRepository = AppDataSource.getRepository(User);
  const chatHistoryRepository = AppDataSource.getRepository(ChatHistory);

  const expressApp = express();
  const httpServer = createServer(expressApp);
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

  httpServer.listen(port, () => {
    console.log(`WebSocket server listening on ${port} port`);
  });

  await AppDataSource.initialize();

  expressApp.use(express.json());
  expressApp.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  expressApp.use("/signUp", signUpRouter);
  expressApp.use("/user", loginRouter);
  expressApp.use("/historicalMessage", historicalMessageRouter);
  expressApp.use("/chatHistory", chatHistoryRouter);

  expressApp.get("/test1", (req, res) => {
    setTimeout(() => {
      res.send("test1 finished");
    }, 10000);
  });
  expressApp.get("/test2", async (req, res) => {
    const promise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve("promise resolved");
      }, 10000);
    });
    await promise;
    res.send("test2 finished");
  });

  // const apiServer = expressApp.listen(port, () => {
  //   console.log(`API server is running on ${port} port`);
  // });
})();
