import { Not, IsNull } from "typeorm";
import ISerie from "~~/base/types/ISerie";
import getDataSource from "../db/dbsigleton";
import Serie, { getSerie } from "../db/entities/Serie";

export const readSeries = async function (query): Promise<Array<ISerie>> {
    const db = await getDataSource();
    console.log(query)
    var tmpQuery = {
      where: {

      },
      order: {
        lastEpisode: 'DESC'
      },
      relations: ['episodes', 'podcasts'],
    };
    if (query.empty!=='true') 
      tmpQuery.where.firstEpisode = Not(IsNull())

    const repo = db.getRepository(Serie);
    return repo.find(tmpQuery);
}

export const readSerie = async function (query): Promise<ISerie> {
  const db = await getDataSource();
  const repo = db.getRepository(Serie);
  var tmpQuery = {
    where: query,
    relations: ['episodes', 'podcasts'],
  };
  var result:Array<ISerie> = await repo.find(tmpQuery);
  return result.pop() as ISerie
}

export const saveNewSerie = async function (SerieObject): Promise<Serie> {
  var Serie = getSerie(SerieObject);
  const db = await getDataSource();
  await db.manager.save(Serie);
  return Serie;
};

export const updateSerie = async function (SerieObject) {
  var Serie = SerieObject;
  const db = await getDataSource();
  return await db.manager.update(Serie, SerieObject.id, Serie);
};