import getDataSource from "~~/backend/dbsigleton";
import Episode from "~~/backend/entities/Episode";

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  return getDataSource().then(async (db) => {
    const repo = db.getRepository(Episode);
    var result = {};
    if (query.id || query.slug) {
      var tmpQuery = {
        where: query,
        relations: ["podcast", "serie"],
      };
      result = await repo.findOne(tmpQuery);
    } else result = await repo.find();
    return result;
  });
});
