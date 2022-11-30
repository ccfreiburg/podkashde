import { Not } from "typeorm";
import getDataSource from "../db/dbsigleton";
import Episode from "../db/entities/Episode";

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
    const result = await db.manager.countBy(Episode, q);
    return result;
  });
});
