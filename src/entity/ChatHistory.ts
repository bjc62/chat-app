import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
// import { User } from "./User";

@Entity()
class ChatHistory {
  @PrimaryColumn()
  oneReceipient!: string;

  @Column()
  theOtherReceipient!: string;

  // @ManyToOne(() => User, (user) => user.chatHistory)
  // user!: User;

  constructor(oneReceipient: string, theOtherReceipient: string) {
    this.oneReceipient = oneReceipient;
    this.theOtherReceipient = theOtherReceipient;
  }
}

export default ChatHistory;
