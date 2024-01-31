import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import Episode from "./Episode";
import Podcast from "./Podcast";

@Entity()
export default class Serie extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  description: string;

  @Column("text")
  title: string;

  @Column("text")
  subtitle: string;

  @Column("text")
  slug: string;

  @Column("text")
  cover_file: string;

  @CreateDateColumn({ type: "datetime", nullable: true })
  firstEpisode: Date;

  @CreateDateColumn({ type: "datetime", nullable: true })
  lastEpisode: Date;

  @Column("int")
  state: number;

  @Column("int")
  external_id: number;

  @Column("text")
  lastbuild: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  draft: boolean;

  @OneToMany(() => Episode, (episode) => episode.serie)
  episodes: Episode[];

  @CreateDateColumn({ type: "datetime" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  public updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  public deletedAt: Date;
}
