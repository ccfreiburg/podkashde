import getDataSource from "~~/backend/dbsigleton";
import Podcast from "~/backend/entities/Podcast";

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  return getDataSource().then(async (db) => {
    const repo = db.getRepository(Podcast);
    var result = {};
    if (query.id || query.slug) result = await repo.findOneBy(query);
    else result = await repo.find();
    return result;
  });
});
