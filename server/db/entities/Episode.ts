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
import IEpisode, { initEpisode } from "../../../base/types/IEpisode";
import Podcast from "./Podcast";
import Serie from "./Serie";


export function getEpisode(from) {
  var episode = new Episode();
  episode.id = from.id;
  episode.image = from.image;
  episode.postimage = from.postimage;
  episode.title = from.title;
  episode.keyword = from.keyword;
  episode.slug = from.slug;
  episode.subtitle = from.subtitle;
  episode.creator = from.creator;
  episode.explicit = from.explicit;
  episode.block = from.block;
  episode.link = from.link;
  episode.duration = from.duration;
  episode.pubdate = new Date(from.pubdate);
  if (from.hasOwnProperty("rawsize")) episode.rawsize = from.rawsize;
  if (from.hasOwnProperty("summary")) episode.description = from.summary;
  if (from.hasOwnProperty("description"))
    episode.description = from.description;
  if (from.hasOwnProperty("state")) episode.state = from.state;
  if (from.hasOwnProperty("external_id"))
    episode.external_id = from.external_id;
  if (from.hasOwnProperty("ext_series_id"))
    episode.ext_series_id = from.ext_series_id;
  if (from.hasOwnProperty("ext_podcast_id"))
    episode.ext_podcast_id = from.ext_podcast_id;
  if (from.hasOwnProperty("lastbuild")) episode.lastbuild = from.lastbuild;
  return episode;
}

@Entity()
export default class Episode extends BaseEntity implements IEpisode {

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

  @Column("int")
  external_id: number;

  @Column("int")
  ext_series_id: number;

  @Column("int")
  ext_podcast_id: number;

  @Column("text")
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

