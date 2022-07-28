import IEpisode from "~~/base/types/IEpisode";
import getDataSource from "../db/dbsigleton";
import Episode from "../db/entities/Episode";

export const readEpisodes = async function (query): Promise<Array<IEpisode>> {
    const db = await getDataSource();
    const repo = db.getRepository(Episode);
    var result = [];
    if (query.id || query.slug) {
        var tmpQuery = {
          where: query,
          relations: ["podcast", "serie"],
        };
        result = await repo.find(tmpQuery);
      } else result = await repo.find();
    return result;
}