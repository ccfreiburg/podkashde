import fs from 'fs'
import { DATA_PATH } from '~~/base/Constants';

export default defineEventHandler( async (event) => {
    const query = useQuery(event);
    const path = DATA_PATH + query.path;
    const stream = fs.createReadStream(path);
    //stream.pipe(event.res);
    event.res.statusCode = 201
    return sendStream(event,stream)
})