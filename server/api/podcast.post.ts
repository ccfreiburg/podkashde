import fs from "fs";
import multer from "multer";
import Podcast from "~~/backend/entities/Podcast";
import getDataSource from "~~/backend/dbsigleton";

const SERVER_IMG_PATH = "data/img/";

const upload = multer({ dest: "upload/" });
const coverParser = upload.single("cover");

export default defineEventHandler(async (event) => {
  var retCode = {
    status: 500,
    message: "Some uncaught internal error",
  };
  return new Promise((resolve, reject) => {
    coverParser(event.req, event.res, async () => {
      try {
        const podcast = new Podcast();
        for (const key in (event.req as any).body) {
          podcast[key] = (event.req as any).body[key];
        }

        var isUpdate = podcast.id && podcast.id > 0;

        if (!event.req["file"] && !isUpdate) {
          reject({
            status: 415,
            message: "No cover image",
          });
        }
        if (event.req["file"]) {
          const upload_path = event.req["file"].path;
          fs.renameSync(upload_path, SERVER_IMG_PATH + podcast.cover_file);
        }

        const db = await getDataSource();
        if (isUpdate) await db.manager.update(Podcast, podcast.id, podcast);
        else await db.manager.save(podcast);

        resolve({
          status: 201,
          message: "Saved podcast successfully",
        });
      } catch (err) {
        if (err) retCode.message = err.message;
      }
      reject(retCode);
    });
  });
});
