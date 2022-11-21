import getDataSource from "../db/dbsigleton";
import Episode from "../db/entities/Episode";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  return getDataSource().then(async (db) => {
    const result = await db.manager.countBy(Episode, query);
    return result;
  });
});
