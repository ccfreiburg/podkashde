import IEpisode from "./IEpisode";

export interface IPodcast {
  id: number;
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
  episodes: Array<IEpisode>;
}