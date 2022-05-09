import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Podcast extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    title: string

    @Column("text")
    subtitle: string

    @Column("text")
    author: string

    @Column("text")
    summary: string
}