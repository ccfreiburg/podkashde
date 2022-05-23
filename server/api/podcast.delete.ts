import Podcast from "~~/backend/entities/Podcast";
import getDataSource from "~~/backend/dbsigleton";

export default defineEventHandler(async (event) => {
  var retCode = {
    status: 500,
    message: "Some uncaught internal error",
  };
  return new Promise(async (resolve, reject) => {
    const body = await useBody(event);
    var id = body["id"];
    return getDataSource().then(async (db) => {
      const result = await db.manager.delete(Podcast, id);
      if (result && result.affected == 1)
        resolve({
          status: 201,
          message: "Podcast deleted successfully",
        });
      else reject(retCode);
    });
  });
});
