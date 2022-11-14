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
import { ContentState } from "../../../base/types/ContentState";
import ISerie from "../../../base/types/ISerie";
import Episode from "./Episode";
import Podcast from "./Podcast";

export function initSerie(serie: Serie) {
  serie.cover_file = "";
  serie.title = "";
  serie.slug = "";
  serie.subtitle = "";
  serie.description = "";
  serie.state = ContentState.draft;
  serie.lastbuild = "";
  serie.external_id = -1;
  serie.firstEpisode = null;
  serie.lastEpisode = null;
}

export function getSerie(from): Serie {
  var serie = new Serie();
  initSerie(serie);
  serie.cover_file = from.cover_file;
  serie.title = from.title;
  serie.slug = from.slug;
  serie.subtitle = from.subtitle;
  serie.state = from.state;
  serie.firstEpisode = from.firstEpisode;
  serie.lastEpisode = from.lastEpisode;
  if (from.hasOwnProperty("id")) serie.id = from.id;
  if (from.hasOwnProperty("external_id")) serie.external_id = from.external_id;
  if (from.hasOwnProperty("description")) serie.description = from.description;
  return serie;
}

@Entity()
export default class Serie extends BaseEntity implements ISerie {

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

  @OneToMany(() => Episode, (episode) => episode.serie)
  episodes: Episode[];

  @ManyToMany(() => Podcast, (podcast) => podcast.series, {
    cascade: false,
  })
  @JoinTable()
  podcasts: Podcast[];

  @CreateDateColumn({ type: "datetime" })
  public createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  public updatedAt: Date;

  @DeleteDateColumn({ type: "datetime" })
  public deletedAt: Date;
}
