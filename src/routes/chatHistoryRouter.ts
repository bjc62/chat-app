import { Router } from "express";
import ChatHistory from "../entity/ChatHistory";
import { AppDataSource } from "../connection/dataSource";

const chatHistoryRouter = Router();
const chatHistoryRepository = AppDataSource.getRepository(ChatHistory);

chatHistoryRouter.get("/", async (req, res) => {
  const userEmail = req.query.userEmail as string;
  const chatHistories = await chatHistoryRepository
    .createQueryBuilder("chatHistory")
    .where("chatHistory.oneReceipient = :email", { email: userEmail })
    .getMany();
  console.log(`queried chatHistories: ${JSON.stringify(chatHistories)}`);
  res.send(chatHistories);
  return;
});

export default chatHistoryRouter;
