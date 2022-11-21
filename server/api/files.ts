import fs from 'fs'
import { DATA_PATH } from '~~/base/Constants';

export default defineEventHandler( async (event) => {
    const query = getQuery(event);
    const path = DATA_PATH + query.path;
    console.log(path)
    return sendStream(event,fs.createReadStream(path))
})