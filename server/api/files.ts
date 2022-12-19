import fs from 'fs'
import {sendError} from 'h3'
import { DATA_PATH } from '~~/base/Constants';
import { getPathForMediaFile } from '../services/episodeService';

export default defineEventHandler( async (event) => {
    const query = getQuery(event);
    var path = ''
    if (query.path)
        path = DATA_PATH + query.path;
    else if (query.name) {
        path = DATA_PATH +  await getPathForMediaFile(query.name)
    } else
        sendError(event, createError("No path or filename provided"))
    console.log(path)
    return sendStream(event,fs.createReadStream(path))
})