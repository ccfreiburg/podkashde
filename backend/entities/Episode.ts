import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Podcast from "./Podcast";
import Serie from "./Serie";

export function initEpisode(episode) {
  episode.image = "";
  episode.title = "";
  episode.slug = "";
  episode.keyword = "";
  episode.subtitle = "";
  episode.creator = "";
  episode.summary = "";
  episode.description = "";
  episode.block = false;
  episode.explicit = false;
  episode.link = "";
  episode.duration = "";
  episode.pubdate = "";
  episode.state = -1;
  episode.external_id = -1;
  episode.ext_series_id = -1;
  episode.ext_podcast_id = -1;
  episode.lastbuild = "";
  episode.rawsize = 0;
}

export function getEpisode(from) {
  var episode = new Episode();
  episode.id = from.id;
  episode.image = from.image;
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
export default class Episode extends BaseEntity {
  constructor() {
    super();
    initEpisode(this);
  }

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
  description: string;

  @Column("text")
  subtitle: string;

  @Column("text")
  keyword: string;

  @Column("text")
  summary: string;

  @Column("text")
  image: string;

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
}
