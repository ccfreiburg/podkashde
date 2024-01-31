import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Enumerator extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  displaytext: string;

  @Column("text")
  shorttext: string;

  @Column("text")
  parentCategory: string;

  @Column("int")
  enumkey_id: number;

  @Column("int")
  enumvalue_id: number;
}


export function getEnumerator(json: Object): Enumerator {
  const enumerator = new Enumerator();
  enumerator.displaytext = json["displaytext"] as string;
  enumerator.shorttext = json["shorttext"] as string;
  enumerator.parentCategory = json["parentCategory"] as string;
  enumerator.enumkey_id = json["enumkey_id"] as number;
  enumerator.enumvalue_id = json["enumvalue_id"] as number;
  if (json.hasOwnProperty("id")) enumerator.id = json["id"] as number;
  return enumerator;
}