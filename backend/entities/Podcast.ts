import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export function initPodcast(podcast) {
  podcast.cover_file = "";
  podcast.title = "";
  podcast.subtitle = "";
  podcast.author = "";
  podcast.summary = "";
  podcast.description = "";
  podcast.language_id = -1;
  podcast.category_id = -1;
  podcast.type_id = -1;
  podcast.explicit = false;
  podcast.link = "";
  podcast.copyright = "";
  podcast.owner_name = "";
  podcast.owner_email = "";
}

export function clonePodcastFromObject(from) {
  var podcast = new Podcast();
  podcast.id = from.id;
  podcast.cover_file = from.cover_file;
  podcast.title = from.title;
  podcast.subtitle = from.subtitle;
  podcast.author = from.author;
  podcast.summary = from.summary;
  podcast.description = from.description;
  podcast.language_id = from.language_id;
  podcast.category_id = from.category_id;
  podcast.type_id = from.type_id;
  podcast.explicit = from.explicit;
  podcast.link = from.link;
  podcast.copyright = from.copyright;
  podcast.owner_name = from.owner_name;
  podcast.owner_email = from.owner_email;
  return podcast;
}

@Entity()
export default class Podcast extends BaseEntity {
  constructor() {
    super();
    initPodcast(this);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  cover_file: string;

  @Column("text")
  title: string;

  @Column("text")
  subtitle: string;

  @Column("text")
  author: string;

  @Column("text")
  summary: string;

  @Column("text")
  description: string;

  @Column("int")
  language_id: number;

  @Column("int")
  category_id: number;

  @Column("int")
  type_id: number;

  @Column("boolean")
  explicit: boolean;

  @Column("text")
  link: string;

  @Column("text")
  copyright: string;

  @Column("text")
  owner_name: string;

  @Column("text")
  owner_email: string;
}
