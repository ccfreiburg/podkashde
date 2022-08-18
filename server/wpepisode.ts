import getDataSource from "../dbsigleton";
import Episode from "../entities/Episode";
import Podcast from "../entities/Podcast";
import Serie from "../entities/Serie";

export const migrateEpisodes = async (episodes: Array<Episode>) => {
  const db = await getDataSource();
  const serieRepo = db.getRepository(Serie);
  const podcastRepo = db.getRepository(Podcast);
  const podcast = await podcastRepo.findOne({
    where: { external_id: episodes[0].ext_podcast_id },
  });
  episodes.forEach(async (episode) => {
    const serie = await serieRepo.findOne({
      where: { external_id: episode.ext_series_id },
    });
    episode.podcast = podcast;
    episode.serie = serie;
    db.manager.save(episode);
    if (serie.podcast == undefined) {
      serie.podcast = podcast;
      db.manager.save(serie);
    }
  });
};
