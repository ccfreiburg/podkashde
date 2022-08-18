import getDataSource from "~~/server/db/dbsigleton";
import Enumerator from "~~/server/db/entities/Enumerator";

export default defineEventHandler( (event) => {   
    return getDataSource().then( async (db) => {
        const repo = db.getRepository(Enumerator)
        return await repo.find()
    })
});