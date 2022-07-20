import getDataSource from "~~/backend/dbsigleton";
import Episode from "~~/backend/entities/Episode";

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  return getDataSource().then(async (db) => {
    const result = await db.manager.countBy(Episode, query);
    return result;
  });
});
