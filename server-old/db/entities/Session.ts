import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import ISession from "../../../base/types/ISession";
import User from "./User";

export function getSession( sessiondata: ISession) {
  var session = new Session();
  if (session.id>0)
    session.id = sessiondata.id;
  session.userId = sessiondata.userId;
  session.refreshToken = sessiondata.refreshToken;
  return session;
}

@Entity()
export default class Session extends BaseEntity implements ISession{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  userId: number;

  @Column("text")
  refreshToken: string;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @CreateDateColumn({ type: "datetime" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  public updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  public deletedAt: Date;
}
