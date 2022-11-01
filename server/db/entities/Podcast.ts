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
} from 'typeorm';
import IPodcast, { emptyIPodcastFactory } from '../../../base/types/IPodcast';
import Episode, { getEpisode } from './Episode';
import Serie, { getSerie } from './Serie';

export function initPodcast(podcast: Podcast): IPodcast {
  setPodcast(podcast, emptyIPodcastFactory());
  return podcast;
}

export function setPodcast(podcast: Podcast, from: IPodcast): Podcast {
  if (!from) return podcast;
  if ('id' in from) podcast.id = from.id;
  podcast.cover_file = from.cover_file;
  podcast.title = from.title;
  podcast.slug = from.slug;
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
  if (from.hasOwnProperty('state')) podcast.state = from.state;
  if (from.hasOwnProperty('lastbuild')) podcast.lastbuild = from.lastbuild;
  if (from.hasOwnProperty('external_id'))
    podcast.external_id = from.external_id;
  return podcast;
}

 export function getPodcast(from : Podcast): Podcast {
  var podcast = setPodcast(new Podcast(), from);
  if (from.episodes) {
    podcast.episodes = from.episodes.map((element) => getEpisode(element));
  }
  if (from.series) {
    podcast.series = from.series.map((element) => getSerie(element));
  }
  return podcast;
}

@Entity()
export default class Podcast extends BaseEntity implements IPodcast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  cover_file: string;

  @Column('text')
  title: string;

  @Column('text')
  slug: string;

  @Column('text')
  subtitle: string;

  @Column('text')
  author: string;

  @Column('text')
  summary: string;

  @Column('text')
  description: string;

  @Column('int')
  language_id: number;

  @Column('int')
  category_id: number;

  @Column('int')
  type_id: number;

  @Column('boolean')
  explicit: boolean;

  @Column('text')
  link: string;

  @Column('text')
  copyright: string;

  @Column('text')
  owner_name: string;

  @Column('text')
  owner_email: string;

  @Column('text')
  lastbuild: string;

  @Column('int')
  state: number;

  @Column('int')
  external_id: number;

  @OneToMany(() => Episode, (episode) => episode.podcast, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  episodes: Episode[];

  @ManyToMany(() => Serie, (serie) => serie.podcasts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  series: Serie[];

  @CreateDateColumn({ type: 'datetime' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  public deletedAt: Date;
}
