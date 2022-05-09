import multer from "multer";
import { Podcast } from "~~/backend/entities/Podcast";
import  getDataSource from "~~/backend/dbsigleton";

const upload = multer({ dest: "upload/" });
const coverParser = upload.single("cover");

export default defineEventHandler( async (event) => {   
    await coverParser(event.req, event.res, async() => {
        //console.log(event.req["file"].path);
        const podcast = new Podcast();
        for(const key in (event.req as any).body) {
          console.log(key)
          podcast[key] = (event.req as any).body[key];
       }
       getDataSource().then((db) => {
           db.manager.save(podcast);
       })
    })
    return {
            status: 201,
            message: "uploaded podcast meta data"
    };
});