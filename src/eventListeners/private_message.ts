import { Socket } from "socket.io";
import UserSocketMap from "../services/UserSocketMap";
import ChatHistory from "../entity/ChatHistory";
import { saveMessage } from "../model/message";
import { AppDataSource } from "../connection/dataSource";

const privateMessageEvent = (socket: Socket) => {
  const chatHistoryRepository = AppDataSource.getRepository(ChatHistory);
  socket.on(
    "private_message",
    async ({ fromUserEmail, toUserEmail, timestamp, content }) => {
      // send message to receipient socket
      const toSocketId = UserSocketMap.getInstance().get(toUserEmail);
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
};

export default privateMessageEvent;
