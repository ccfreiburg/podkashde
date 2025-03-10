import type {IEpisode} from './IEpisode';
import type {ISerie} from './ISerie';

export interface IPodcast {
  id?: number;
  cover_file: string;
  title: string;
  author: string;
  slug: string;
  subtitle: string;
  summary: string;
  description: string;
  link: string;
  copyright: string;
  owner_name: string;
  owner_email: string;
  lastbuild: string;
  language_id: number;
  category_id: number;
  type_id: number;
  explicit: boolean;
  state: number;
  draft: boolean;
  external_id: number;
  apple_url: string;
  spotify_url: string;
  google_url: string;  
  stitcher_url: string;
  episodes?: Array<IEpisode>;
  series?: Array<ISerie>;
  updatedAt?: Date;
}

export function emptyIPodcastFactory(): IPodcast {
  var pod: IPodcast = {
    cover_file: '',
    title: '',
    slug: '',
    subtitle: '',
    author: '',
    summary: '',
    description: '',
    language_id: -1,
    category_id: -1,
    type_id: -1,
    explicit: false,
    link: '',
    copyright: '',
    owner_name: '',
    owner_email: '',
    state: -1,
    draft: false,
    lastbuild: '',
    external_id: -1,
    apple_url: '',
    spotify_url: '',
    google_url: '',  
    stitcher_url: ''
    };
  return pod;
}
