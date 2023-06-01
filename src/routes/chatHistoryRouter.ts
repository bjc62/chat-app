// an Express router to take fromUserEmail, toUserEmail and timestamp as query parameters
// and return the chat history between the two users.
import { Router, Request, Response } from "express";
import { Message, getChatHistory } from "../model/message";

const chatHistoryRouter = Router();

chatHistoryRouter.get("/", async (req: Request, res: Response) => {
  console.log("getting chat history");
  const fromUserEmail = req.query.fromUserEmail as string;
  const toUserEmail = req.query.toUserEmail as string;
  const timestamp = Number(req.query.timestamp);

  try {
    const messages = await getChatHistory(
      fromUserEmail,
      toUserEmail,
      timestamp
    );
    res.send(messages);
  } catch (exception) {
    console.error(`get chat history error: ${exception}`);
    res.status(500).json({ error: `get chat history error: ${exception}` });
  }
  console.log("finished getting chat history");
  return;
});

export default chatHistoryRouter;
