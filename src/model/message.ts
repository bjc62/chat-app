import db from "./db";
import { EntryStream } from "level-read-stream";

export interface Message {
  fromUserEmail: string;
  toUserEmail: string;
  content: string;
  timestamp: number;
}

export const saveMessage = async (message: Message) => {
  const key = `${message.fromUserEmail}:${message.toUserEmail}:${message.timestamp}`;
  await db.put(key, message.content);
};

export const getHistoricalMessages = async (
  fromUserEmail: string,
  toUserEmail: string,
  timestamp: number
): Promise<Message[]> => {
  const messages: Message[] = [];

  // fetching message from "from to to"
  const fromToToStream = new EntryStream(db, {
    gte: `${fromUserEmail}:${toUserEmail}:${timestamp}`,
  });

  for await (const data of fromToToStream) {
    const [fromUserEmailDB, toUserEmailDB, timestampDB] = data.key.split(":");
    const content = data.value as string;
    const message: Message = {
      fromUserEmail: fromUserEmailDB,
      toUserEmail: toUserEmailDB,
      timestamp: Number(timestampDB),
      content,
    };
    messages.push(message);
  }

  // fetching message from "to to from"
  const toToFromStream = new EntryStream(db, {
    gte: `${toUserEmail}:${fromUserEmail}:${timestamp}`,
  });

  for await (const data of toToFromStream) {
    const [fromUserEmailDB, toUserEmailDB, timestampDB] = data.key.split(":");
    const content = data.value as string;
    const message: Message = {
      fromUserEmail: fromUserEmailDB,
      toUserEmail: toUserEmailDB,
      timestamp: Number(timestampDB),
      content,
    };
    messages.push(message);
  }

  return messages;
};
