import IEpisode from './IEpisode';

export default interface IPodcast {
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
  external_id: number;
  episodes?: Array<IEpisode>;
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
    lastbuild: '',
    external_id: -1,
  };
  return pod;
}
