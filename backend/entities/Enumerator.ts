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
    enum_id: number

    @Column("int")
    order_id: number
}
