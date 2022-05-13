import fs from "fs";
import multer from "multer";
import Podcast from "~~/backend/entities/Podcast";
import getDataSource from "~~/backend/dbsigleton";

const upload = multer({ dest: "upload/" });
const coverParser = upload.single("cover");

export default defineEventHandler( async (event) => {   
    await coverParser(event.req, event.res, async() => {
        const podcast = new Podcast();
        for(const key in (event.req as any).body) {
          podcast[key] = (event.req as any).body[key];
       }
       podcast.cover_file = event.req["file"].originalname
       fs.renameSync(event.req["file"].path, "data/img/"+ podcast.cover_file);

       getDataSource().then((db) => {          
           db.manager.save(podcast);
       })
    })
    return {
            status: 201,
            message: "uploaded podcast meta data"
    };
});