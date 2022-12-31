import fs from 'fs'
import {sendError} from 'h3'
import { ARCHIV_PATH } from '~~/base/Constants';
import { findFile } from '../findFilePath';

export default defineEventHandler( async (event) => {
    const query = getQuery(event);
    if (query.name) {
      return { path: findFile(query.name, ARCHIV_PATH) }
    } else
        sendError(event, createError("No path or filename provided"))
    return { path:"" }
})