import fs from 'fs'
import {sendError} from 'h3'
import { ARCHIV_PATH } from '~~/base/Constants';
import { findFile } from '../findFilePath';
import { IFetchFileResult } from '../../base/types/IFetchFileResult';
import { copyFile } from '../services/filesService';


export default defineEventHandler( async (event) => {
  const body = await readBody(event);
  const path = findFile(body.name, ARCHIV_PATH) 
  if (path && path.length>0) {
    var newpath = body.serverPath + body.slug;
    if (copyFile(path, newpath, body.name))
      return {
        status: 201,
        message: 'File fetched',
        path: newpath + '/' + body.name,
      }
  }
  return sendError(event, createError({statusCode: 500, statusMessage:  "File not found"}))
})