import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  email!: string;

  @ManyToMany(() => User)
  @JoinTable()
  chatHistory?: User[];

  constructor(email: string) {
    this.email = email;
  }
}
