import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../../../base/types/IUser";
import Session from "./Session";

export function getUser( userdata: IUser ) {
  var user = new User();
  if (userdata.id>0)
    user.id = userdata.id;
  user.username = userdata.username;
  user.email = userdata.email;
  user.password = userdata.password;
  user.name = userdata.name;
  return user;
}

@Entity()
export default class User extends BaseEntity implements IUser{
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  username: string;

  @Column("text")
  name: string;

  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @OneToMany(() => Session, (session) => session.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  sessions: Session[];
}
