import * as fs from 'fs';
import { Request, Response } from "express";
import { getFileFromUrl } from "../services/filesService";
import { ARCHIV_PATH, DATA_PATH, FEED_SLUG, UPLOAD_TEMP_PATH, getBaseUrl } from "../tools/Configuration";
import { getPathForMediaFile } from "../services/episodeService";
import { copyFile, createDir, findFile, moveFile } from "../tools/DataFiles";
import busboy = require('busboy');
import { respond } from '../tools/Controller';

export async function fetchFileAction(request: Request, response: Response) {

    const body = request.body as any;
    const result = await getFileFromUrl(body.orgurl,body.newpath, body.altpath, body.newfile)
    respond(response, result.statusCode, result)
}

export async function downloadFileAction(request: Request, response: Response) {
    var path = ''
    if (request.params.path)
        path = DATA_PATH + request.params.path;
    else if (request.params.name) {
        path = DATA_PATH +  await getPathForMediaFile(request.params.name)
    } else
        respond(response, 404, {statusCode: 404, message: "No path or filename provided"})
    return response.download(path)
}

export async function copyFromLocalArchive(request: Request, response: Response) {
    const path = findFile(request.body.name, ARCHIV_PATH) 
    if (path && path.length>0) {
      var newpath = request.body.serverPath + request.body.slug;
      if (copyFile(path, newpath, request.body.name))
        return respond(response, 201, {
          statusCode: 201,
          message: 'File fetched',
          path: newpath + '/' + request.body.name,
        })
    }
    return respond(response, 500, {statusCode: 500, message:  "File not found"})
  
}

export async function uploadFile(request: Request, response: Response) {

try {
    createDir(UPLOAD_TEMP_PATH)
    const { filename, path, uploaded } = await paseFormdata(request,response)
    if (moveFile(uploaded, path, filename))
      return respond(response, 201, {statusCode: 201, message: 'Created '+path+filename});
  } catch (err) {
    return respond(response, 500, {statusCode: 500, message: err.message});
  }
  return respond(response, 500, {statusCode: 500, message: 'No File found'});
}

export async function paseFormdata(request: Request, response: Response) : Promise<{ uploaded: string, path: string, filename: string }> {
    return new Promise((resolve) => {
        var filedata = {} as any
        const fields = {} as any
        const busb = busboy({ headers: request.headers })
        busb.on('file', (name: string, file: any, info: any) => {
          var { filename, encoding, mimeType } = info
          if (filename.length==0)
            filename = "tmp"
          const path = UPLOAD_TEMP_PATH+filename;
          var ws = fs.createWriteStream(path)
          filedata = {
            fieldname: name,
            path,
            filename,
            encoding,
            mimeType
          }
          file.on('close',()=>{
            ws.close()
          })
          file.on('data',(chunk)=>{
            ws.write(chunk)
          })
        })
        busb.on('field', (name : string, value: object, info: any) => {
          fields[name] = value
        })
        busb.on('close', () => {
          resolve({ uploaded: filedata.path, path: fields.path, filename: fields.filename })
        })
        request.pipe(busb)
        return
      })

}
