import Podcast from "~~/server/db/entities/Podcast";
import getDataSource from "~~/server/db/dbsigleton";
import { returnCode } from "~~/server/returncode";

export default defineEventHandler(async (event) => {
  return new Promise(async (resolve, reject) => {
    const body = await readBody(event);
    var id = body["id"];
    return getDataSource().then(async (db) => {
      const result = await db.manager.softDelete(Podcast, id);
      if (result && result.affected == 1)
        resolve(returnCode(201, "Podcast deleted successfully"));
      else reject(returnCode(500, "Some uncaught internal error"));
    });
  });
});
