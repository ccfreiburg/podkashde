import type {IPodcast} from "./IPodcast";
import type {ISerie} from "./ISerie";

export interface IEpisode {
    id?: number;
    image: string;
    postimage?: string;
    title: string;
    slug: string;
    keyword: string;
    subtitle: string;
    creator: string;
    summary: string;
    description: string;
    block: boolean;
    explicit: boolean;
    link: string;
    duration: number;
    pubdate: Date;
    state: number;
    draft: boolean;
    rawsize: number;
    video_link?: string;
    cross_ref?: string;
    external_id?: number;
    ext_series_id?: number;
    ext_podcast_id?: number;
    serie_id?: number;
    lastbuild?: string;
    podcast?: IPodcast;
    serie?: ISerie;    
}

export function emptyIEpisodeFactory(): IEpisode {
  var episode: IEpisode = {    
    image: "",
    postimage: "",
    title: "",
    slug: "",
    keyword: "",
    subtitle: "",
    creator: "",
    summary: "",
    description: "",
    block: false,
    explicit: false,
    link: "",
    duration: 0,
    pubdate: new Date(),
    state: -1,
    draft: false,
    external_id: -1,
    ext_series_id: -1,
    ext_podcast_id: -1,
    serie_id: -1,
    lastbuild: "",
    rawsize: 0,
  }
  return episode;
}
  