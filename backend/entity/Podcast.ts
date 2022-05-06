import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Podcast extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    title: string
}