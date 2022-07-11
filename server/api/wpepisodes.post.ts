import { Db } from "typeorm";
import getDataSource from "~~/backend/dbsigleton";
import { getEpisode } from "~~/backend/entities/Episode";
import Podcast from "~~/backend/entities/Podcast";
import Serie from "~~/backend/entities/Serie";

export default defineEventHandler(async (event) => {
  var retCode = {
    status: 500,
    message: "Some uncaught internal error",
  };
  return new Promise(async (resolve, reject) => {
    try {
      const body = await useBody(event);
      const db = await getDataSource();

      var episodes = body.map((item) => getEpisode(item));

      if (episodes.length > 0) {
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
        resolve({
          status: 201,
          message: "Saved series successfully",
        });
      } else {
        retCode.message = "No data";
      }
    } catch (err) {
      if (err) retCode.message = err.message;
    }
    reject(retCode);
  });
});
