export default interface IEpisode {
    image: string;
    postimage: string;
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
    external_id: number;
    ext_series_id: number;
    ext_podcast_id: number;
    lastbuild: string;
    rawsize: number;
  }

  export function initEpisode(episode :IEpisode) : IEpisode {
    episode.image = "";
    episode.postimage = "";
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
    episode.duration = 0;
    episode.pubdate = new Date();
    episode.state = -1;
    episode.external_id = -1;
    episode.ext_series_id = -1;
    episode.ext_podcast_id = -1;
    episode.lastbuild = "";
    episode.rawsize = 0;
    return episode
  }
  