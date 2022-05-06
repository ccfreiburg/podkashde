import multer from "multer";
import { Podcast } from "~~/backend/entity/Podcast";
import  getDataSource from "~~/backend/entity/index";

const upload = multer({ dest: "upload/" });
const coverParser = upload.single("cover");

export default defineEventHandler( async (event) => {   
    await coverParser(event.req, event.res, async() => {
        //console.log(event.req["file"].path);
        const podcast = new Podcast();
        podcast.title = (event.req as any).body["title"];
        getDataSource().then((db) => {
            db.manager.save(podcast);
        })
    })
    return {
            status: 201,
            message: "uploaded podcast meta data"
    };
});