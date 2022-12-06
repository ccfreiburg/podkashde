import { Not } from "typeorm";
import getDataSource from "../db/dbsigleton";
import Episode from "../db/entities/Episode";
import Serie from "../db/entities/Serie";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = {}
  if (query.hasOwnProperty('excludeId')) {
    const id = query['excludeId']
    q['id'] = Not(id)
  }
  if (query.hasOwnProperty('id')) {
    q['id'] = query.id
  }
  if (query.hasOwnProperty('slug')) {
    q['slug'] = query.slug
  }
  return getDataSource().then(async (db) => {
    var result = 0;
    if (query.hasOwnProperty('serie')) 
      result = await db.manager.countBy(Serie, q);
    else 
      result = await db.manager.countBy(Episode, q);
    return result;
  });
});
