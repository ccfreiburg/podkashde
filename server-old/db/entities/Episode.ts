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
import IEpisode from "../../../base/types/IEpisode";
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
  episode.draft = from.draft;
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
  if (from.hasOwnProperty("video_link")) episode.video_link = from.video_link;
  if (from.hasOwnProperty("cross_ref")) episode.cross_ref = from.cross_ref;
  return episode;
}

export function joinEpisodePodcastAndSerie(episode: Episode, podcast: Podcast, serie: Serie) {
  if (podcast) {
    episode.podcast = podcast;
  }
  if (serie) {
    episode.serie = serie;
    if (!serie.episodes)
      serie.episodes = [] as Array<Episode>
    serie.episodes.push(episode)
    if (serie.firstEpisode==null) 
      serie.firstEpisode = episode.pubdate
    if (serie.lastEpisode==null)
      serie.lastEpisode = episode.pubdate
    const b = new Date(episode.pubdate).getTime()
    if (new Date(serie.firstEpisode).getTime()>b)
      serie.firstEpisode = episode.pubdate
    if (new Date(serie.lastEpisode).getTime()<b)
      serie.lastEpisode = episode.pubdate
    // You do not need to add podcast to the podcasts of the series this works the other was around is done above
  }
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

