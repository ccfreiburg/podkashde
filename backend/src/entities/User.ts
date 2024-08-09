import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Session from "./Session";

@Entity()
export default class User extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  username: string;

  @Column("text")
  name: string;

  @Column("text")
  email: string;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  token: string;

  @OneToMany(() => Session, (session) => session.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  sessions: Session[];
}
