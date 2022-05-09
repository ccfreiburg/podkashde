import getDataSource from "~~/backend/dbsigleton";
import { Enumerator } from "~~/backend/entities/Enumerator";

export default defineEventHandler( (event) => {   
    return getDataSource().then((db) => {
        const repo = db.getRepository(Enumerator)
        return repo.find()
    })
});