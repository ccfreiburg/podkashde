import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ContentState } from "~~/base/types/ContentState";
import Episode from "~~/server/db/entities/Episode";
import Podcast from "~~/server/db/entities/Podcast";

export function initSerie(serie: Serie) {
  serie.cover_file = "";
  serie.title = "";
  serie.slug = "";
  serie.subtitle = "";
  serie.description = "";
  serie.state = ContentState.draft;
  serie.lastbuild = "";
  serie.external_id = -1;
}

export function getSerie(from): Serie {
  var serie = new Serie();
  serie.cover_file = from.cover_file;
  serie.title = from.title;
  serie.slug = from.slug;
  serie.subtitle = from.subtitle;
  serie.state = from.state;
  if (from.hasOwnProperty("id")) serie.id = from.id;
  if (from.hasOwnProperty("external_id")) serie.external_id = from.external_id;
  if (from.hasOwnProperty("description")) serie.description = from.description;
  return serie;
}

@Entity()
export default class Serie extends BaseEntity {
  constructor() {
    super();
    initSerie(this);
  }

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

  @Column("int")
  state: number;

  @Column("int")
  external_id: number;

  @Column("text")
  lastbuild: string;

  @OneToMany(() => Episode, (episode) => episode.podcast)
  episodes: Episode[];

  @ManyToOne(() => Podcast, (podcast) => podcast.series)
  podcast: Podcast;

  @CreateDateColumn({ type: "datetime" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  public updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  public deletedAt: Date;
}
