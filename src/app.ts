import express from "express";
import cors from "cors";

import signUpRouter from "./routes/signUpRouter";
import loginRouter from "./routes/userRouter";
import { AppDataSource } from "./connection/dataSource";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { saveMessage } from "./model/message";
import historicalMessageRouter from "./routes/historicalMessageRouter";
import { User } from "./entity/User";
import ChatHistory from "./entity/ChatHistory";
import chatHistoryRouter from "./routes/chatHistoryRouter";

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
    socket.on("register", ({ email }) => {
      console.log(`userEmail: ${email} registered`);
      userSocketMap.set(email, socket.id);
    });

    socket.on(
      "private_message",
      async ({ fromUserEmail, toUserEmail, timestamp, content }) => {
        // send message to receipient socket
        const toSocketId = userSocketMap.get(toUserEmail);
        if (toSocketId) {
          socket.to(toSocketId).emit("private_message", {
            fromUserEmail,
            toUserEmail,
            timestamp,
            content,
          });
        } else {
          console.error(`user email not online: ${toUserEmail}. Message will still be sotred in the DB.
          Will be sending notification in future updates.`);
        }

        // save message to db
        try {
          await saveMessage({ fromUserEmail, toUserEmail, timestamp, content });
        } catch (exception) {
          console.error(
            `during receiving private message, saving message error: ${exception}`
          );
        }

        // save chat history to db
        try {
          const chatHistory1 = new ChatHistory(fromUserEmail, toUserEmail);
          const chatHistory2 = new ChatHistory(toUserEmail, fromUserEmail);
          await chatHistoryRepository.save(chatHistory1);
          await chatHistoryRepository.save(chatHistory2);
        } catch (exception) {
          console.error(
            `during receiving private message, saving user error: ${exception}`
          );
        }
      }
    );

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

  apiApp.listen(3001, () => {
    console.log("API server is running on 3001 port");
  });
})();
