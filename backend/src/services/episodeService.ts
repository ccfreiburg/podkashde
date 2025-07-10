import Episode from "../entities/Episode";
import { isUpdate, saveGen, updateGen } from "./genericService";
import { setLastAndFirst } from "./serieService";
import writeTags from "../tools/Id3Tagger";
import Serie from "../entities/Serie";
import Podcast from "../entities/Podcast";
import getRepository, { getDbManager } from "./datasourceService";
import { isQualifiedUrl } from "../tools/Urls";
import { dataPath, getFilename, moveFile } from "../tools/DataFiles";
import { SERVER_MP3_PATH } from "../tools/Configuration";
import { Like } from "typeorm";

export async function saveEpisode(episode : Episode): Promise<Episode> {
  if( isUpdate(episode) ) {
    const record = await getRepository(Episode).preload(episode) as Episode
    await updateGen<Episode>(Episode, record)
    if (episode.serie)
        setLastAndFirst(episode.serie.id)
    return episode;
  } else {
    const id = await saveGen<Episode>(Episode, episode)
    const epi = getEpisode({ ...episode, id }) as Episode
    if (episode.serie)
      setLastAndFirst(episode.serie.id)
    writeTags(epi)
    return epi;
  }
};

export async function moveEpisode(episode : Episode, podcast: Podcast, serie: Serie): Promise<Episode> {
  if (!isQualifiedUrl(episode.link)) {
    const file = getFilename(episode.link)
    const newpath = SERVER_MP3_PATH + podcast.slug
    await moveFile(dataPath(episode.link), newpath, file)
    episode.link = newpath + '/' + file
  }
  episode.podcast = podcast
  episode.serie = serie
  return await saveEpisode(episode)
}

export function getEpisode(from: any) : Episode {
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


export const getPathForMediaFile = async function (filename: string): Promise<string> {
  var tmpQuery = {
    where: {
      link: Like("%"+filename)
    }
  };
  var result = await getRepository(Episode).findOneOrFail(tmpQuery);
  return result.link
}