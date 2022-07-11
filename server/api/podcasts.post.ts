import getDataSource from "~~/backend/dbsigleton";
import Podcast, { getPodcast } from "~~/backend/entities/Podcast";

export default defineEventHandler(async (event) => {
  var retCode = {
    status: 500,
    message: "Some uncaught internal error",
  };
  return new Promise(async (resolve, reject) => {
    try {
      const body = await useBody(event);
      const db = await getDataSource();
      db.manager.save(body.map((item) => getPodcast(item)));
      resolve({
        status: 201,
        message: "Saved enums successfully",
      });
    } catch (err) {
      if (err) retCode.message = err.message;
    }
    reject(retCode);
  });
});
