import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import ChatHistory from "./ChatHistory";

@Entity()
export class User {
  @PrimaryColumn()
  email!: string;

  // @OneToMany(() => ChatHistory, (chatHistory) => chatHistory.user, {
  //   cascade: true,
  // })
  // @JoinColumn()
  // chatHistory?: ChatHistory[];

  constructor(email: string) {
    this.email = email;
  }
}
