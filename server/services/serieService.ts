import ISerie from "~~/base/types/ISerie";
import getDataSource from "../db/dbsigleton";
import Serie, { getSerie } from "../db/entities/Serie";

export const readSeries = async function (): Promise<Array<ISerie>> {
    const db = await getDataSource();
    const repo = db.getRepository(Serie);
    return repo.find();
}

export const readSerie = async function (query): Promise<ISerie> {
  const db = await getDataSource();
  const repo = db.getRepository(Serie);
  var tmpQuery = {
    where: query,
    relations: ["episodes"],
  };
  var result:Array<ISerie> = await repo.find(tmpQuery);
  return result.pop()
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