import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Podcast extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    cover_file: string

    @Column("text")
    title: string

    @Column("text")
    subtitle: string

    @Column("text")
    author: string

    @Column("text")
    summary: string

    @Column("text")
    description: string

    @Column("text")
    language: string

    @Column("text")
    category: string

    @Column("text")
    subcategory: string

    @Column("boolean")
    explicit: boolean

    @Column("text")
    type: string

    @Column("text")
    link: string

    @Column("text")
    copyright: string

    @Column("text")
    owner_name: string
    
    @Column("text")
    owner_email: string
}