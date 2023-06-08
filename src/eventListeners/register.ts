import UserSocketMap from "../services/UserSocketMap";
import { Socket } from "socket.io";

const registerEvent = (socket: Socket) => {
  socket.on("register", ({ email }) => {
    console.log(`registering user with email: ${email}`);
    UserSocketMap.getInstance().set(email, socket.id);
  });
};

export default registerEvent;
