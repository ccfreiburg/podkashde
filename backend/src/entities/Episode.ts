import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Podcast from "./Podcast";
import Serie from "./Serie";


@Entity()
export default class Episode extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  title: string;

  @Column("text")
  link: string;

  @Column("text")
  slug: string;

  @Column("datetime")
  pubdate: Date;

  @Column("text")
  creator: string;

  @Column("text")

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  subtitle: string;

  @Column("text")
  keyword: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  summary: string;

  @Column("text")
  image: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  postimage: string;

  @Column("boolean")
  block: boolean;

  @Column("boolean")
  explicit: boolean;

  @Column("int")
  duration: number;

  @Column("int")
  rawsize: number;

  @Column("int")
  state: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  draft: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  video_link: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  cross_ref: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  external_id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  ext_series_id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  ext_podcast_id: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  lastbuild: string;

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  podcast: Podcast;

  @ManyToOne(() => Serie, (serie) => serie.episodes)
  serie: Serie;

  @CreateDateColumn({ type: "datetime" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  public updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  public deletedAt: Date;
}

