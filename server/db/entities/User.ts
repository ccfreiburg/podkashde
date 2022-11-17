import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IUser } from "../../../base/types/IUser";
import Session from "./Session";

export function getUser( userdata: IUser ) {
  var user = new User();
  if (userdata.id>0)
    user.id = userdata.id;
  user.username = userdata.username;
  user.email = userdata.email;
  if (userdata.hasOwnProperty('email')) 
    user.email = userdata.email;
  else
    user.email = "";
  if (userdata.hasOwnProperty('name')) 
    user.name = userdata.name;
  else
    user.name = "";
  if (userdata.hasOwnProperty('password')) user.password = userdata.password;
  if (userdata.hasOwnProperty('token')) user.token = userdata.token;
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
