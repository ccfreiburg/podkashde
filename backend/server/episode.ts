import getDataSource from "~~/backend/dbsigleton";
import Episode, { getEpisode } from "../entities/Episode";
import { getPodcast } from "../entities/Podcast";
import { getSerie } from "../entities/Serie";

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
  await db.manager.update(Episode, episodeObject.id, episode);
};
