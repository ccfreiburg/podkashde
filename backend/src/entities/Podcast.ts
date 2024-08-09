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
import Episode from './Episode';

@Entity()
export default class Podcast extends BaseEntity {
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

  @Column({
    type: 'boolean',
    default: false,
  })
  draft: boolean;

  @Column({
    type: 'text',
    default: '',
  })
  apple_url: string;

  @Column({
    type: 'text',
    default: '',
  })
  spotify_url: string;

  @Column({
    type: 'text',
    default: '',
  })
  google_url: string;  
  
  @Column({
    type: 'text',
    default: '',
  })
  stitcher_url: string;

  @OneToMany(() => Episode, (episode) => episode.podcast, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  episodes: Episode[];

  @CreateDateColumn({ type: 'datetime' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  public updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  public deletedAt: Date;
}
