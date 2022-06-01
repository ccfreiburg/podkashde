import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Podcast from "./Podcast";

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
}

export function cloneEpisodeFromObject(from) {
  var episode = new Episode();
  episode.id = from.id;
  episode.image = from.image;
  episode.title = from.title;
  episode.keyword = from.keyword;
  episode.slug = from.slug;
  episode.subtitle = from.subtitle;
  episode.creator = from.creator;
  episode.summary = from.summary;
  episode.description = from.description;
  episode.explicit = from.explicit;
  episode.block = from.block;
  episode.link = from.link;
  episode.duration = from.duration;
  episode.pubdate = from.pubdate;
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

  @ManyToOne(() => Podcast, (podcast) => podcast.episodes)
  podcast: Podcast;
}
