import { Not, IsNull } from "typeorm";
import ISerie from "~~/base/types/ISerie";
import getDataSource from "../db/dbsigleton";
import Episode from "../db/entities/Episode";
import Serie, { getSerie } from "../db/entities/Serie";

export const readSeries = async function (query: Partial<ISerie>): Promise<Array<ISerie>> {
    const db = await getDataSource();
    var tmpQuery = {
      where: {

      },
      order: {
        lastEpisode: 'DESC'
      },
      relations: ['episodes'],
    };
    if (query.empty!=='true') 
      tmpQuery.where.firstEpisode = Not(IsNull())

    const repo = db.getRepository(Serie);
    return repo.find(tmpQuery);
}

export const readSerie = async function (query: Partial<ISerie>): Promise<ISerie> {
  const db = await getDataSource();
  const repo = db.getRepository(Serie);
  var tmpQuery = {
    where: query,
    relations: ['episodes'],
  };
  var result:Array<ISerie> = await repo.find(tmpQuery);
  return result.pop() as ISerie
}

export const saveNewSerie = async function (SerieObject: ISerie): Promise<Serie> {
  var Serie = getSerie(SerieObject);
  const db = await getDataSource();
  await db.manager.save(Serie);
  return Serie;
};

export const updateSerie = async function (SerieObject: ISerie) {
  var serie = getSerie(SerieObject);
  const db = await getDataSource();
  return await db.manager.update(Serie, SerieObject.id, serie);
};

export const setLastAndFirst = async ( id: number ) : string => {
  const serie = await readSerie({ id: id })
  var minmax = serie.episodes?.reduce( (minmax, episode) => {
    const d = new Date(episode.pubdate)
    if (d< minmax.min)
      minmax.min = d
    if (d > minmax.max)
      minmax.max = d
    return minmax
  }, { min: new Date(), max: new Date(1900)})
  serie.lastEpisode = minmax?.max
  serie.firstEpisode = minmax?.min
  updateSerie(serie as Serie)
  return serie.slug
}
