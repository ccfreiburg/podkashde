import getDataSource from "~~/backend/dbsigleton";
import Podcast from "~/backend/entities/Podcast";

export default defineEventHandler( (event) => {   
    return getDataSource().then( async (db) => {
        console.log("posdi")       
        const repo = db.getRepository(Podcast)
        return await repo.find()
    })
});