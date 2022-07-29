import IEpisode from "~~/base/types/IEpisode";
import getDataSource from "../db/dbsigleton";
import Episode from "../db/entities/Episode";

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