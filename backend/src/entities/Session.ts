import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./User";

@Entity()
export default class Session extends BaseEntity {
  
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
