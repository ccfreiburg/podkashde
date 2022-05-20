import { BaseEntity, Column, DataSource, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Enumerator extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    displaytext: string

    @Column("text")
    shorttext: string

    @Column("text")
    parentCategory: string

    @Column("int")
    enumkey_id: number

    @Column("int")
    enumvalue_id: number
}
