import getDataSource from "~~/backend/dbsigleton";
import Episode from "~~/backend/entities/Episode";

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  return getDataSource().then(async (db) => {
    const repo = db.getRepository(Episode);
    var result = {};
    if (query.id || query.slug) result = await repo.findOneBy(query);
    if (query.podcastId) {
      var tmpQuery = {
        where: query,
      };
      result = await repo.findBy(query);
    } else result = await repo.find();
    return result;
  });
});
