import Podcast from "~~/backend/entities/Podcast";
import getDataSource from "~~/backend/dbsigleton";
import { returnCode } from "~~/backend/server/returncode";

export default defineEventHandler(async (event) => {
  return new Promise(async (resolve, reject) => {
    const body = await useBody(event);
    var id = body["id"];
    return getDataSource().then(async (db) => {
      const result = await db.manager.softDelete(Podcast, id);
      if (result && result.affected == 1)
        resolve(returnCode(201, "Podcast deleted successfully"));
      else reject(returnCode(500, "Some uncaught internal error"));
    });
  });
});
