import IEpisode from "~~/base/types/IEpisode";
import getDataSource from "../db/dbsigleton";
import Episode, { getEpisode } from "../db/entities/Episode";
import { getPodcast } from "../db/entities/Podcast";
import { getSerie } from "../db/entities/Serie";
import writeTags from "../tagId3";
import { setLastAndFirst } from "./serieService";

export const readEpisodes = async function (): Promise<Array<IEpisode>> {
    const db = await getDataSource();
    const repo = db.getRepository(Episode);
    return repo.find();
}

export const readEpisode = async function (query): Promise<IEpisode> {
  const db = await getDataSource();
  const repo = db.getRepository(Episode);
  var tmpQuery = {
    where: query,
    relations: ["podcast", "serie"],
  };
  var result:Array<IEpisode> = await repo.find(tmpQuery);
  return result.pop()
}

export const saveNewEpisode = async function (episodeObject): Promise<Episode> {
  var episode = getEpisode(episodeObject);
  if ("podcast" in episodeObject) {
    var podcast = getPodcast(episodeObject.podcast);
    episode.podcast = podcast;
  }
  if ("serie" in episodeObject) {
    var serie = getSerie(episodeObject.serie);
    episode.serie = serie;
  }
  const db = await getDataSource();
  await db.manager.save(episode);
  writeTags(episode)
  return episode;
};

export const updateEpisode = async function (episodeObject) {
  var episode = episodeObject;
  if ("podcast" in episodeObject) {
    var podcast = getPodcast(episodeObject.podcast);
    episode.podcast = podcast;
  }
  if ("serie" in episodeObject) {
    var serie = getSerie(episodeObject.serie);
    episode.serie = serie;
  }
  const db = await getDataSource();
  const result = await db.manager.update(Episode, episodeObject.id, episode);
  if (episode.serie)
    setLastAndFirst(episode.serie.id)
  return result
};