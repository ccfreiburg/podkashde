import IEpisode from "~~/base/types/IEpisode";
import getDataSource from "../db/dbsigleton";
import Episode, { getEpisode } from "../db/entities/Episode";
import Podcast from "../db/entities/Podcast";
import Serie from "../db/entities/Serie";

export async function migrateEpisode (episode: IEpisode) {
  const db = await getDataSource();
  const serieRepo = db.getRepository(Serie);
  const podcastRepo = db.getRepository(Podcast);
  const podcast = await podcastRepo.findOne({
    where: { external_id: episode.ext_podcast_id },
  });
  const serie = await serieRepo.findOne({
      where: { external_id: episode.ext_series_id },
  });
  var episodeToSave = getEpisode(episode)
  if (podcast)
    episodeToSave.podcast = podcast;
  if (serie)
    episodeToSave.serie = serie;
  await db.manager.save(episodeToSave);
  if (serie && podcast && serie.podcast == undefined) {
    serie.podcast = podcast;
    await db.manager.save(serie);
  }
};
