import * as fs from 'fs';
import { Request, Response } from "express";
import { getFileFromUrl } from "../services/filesService";
import { ARCHIV_PATH, DATA_PATH, UPLOAD_TEMP_PATH } from "../tools/Configuration";
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
    var error = "create dir"
    createDir(DATA_PATH+UPLOAD_TEMP_PATH)
    var error = "parse form data"
    const { filename, path, uploaded } = await paseFormdata(request,response)
    var error = "move file"
    if (moveFile(uploaded, path, filename))
      return respond(response, 201, {statusCode: 201, message: 'Created '+path+filename});
  } catch (err) {
    return respond(response, 500, {statusCode: 500, message: error + ' ' + err.message});
  }
  return respond(response, 500, {statusCode: 500, message: 'No File found'});
}

export async function paseFormdata(
  request: Request,
  response: Response
): Promise<{ uploaded: string, path: string, filename: string }> {
  return new Promise((resolve, reject) => {
    const filedata: any = {}
    const fields: any = {}
    const busb = busboy({ headers: request.headers })
    let fileWritePromise: Promise<void> | null = null

    busb.on('file', (name: string, file: any, info: any) => {
      let { filename, encoding, mimeType } = info
      if (!filename || filename.length === 0) filename = "tmp"

      const filePath = DATA_PATH + UPLOAD_TEMP_PATH + filename
      const ws = fs.createWriteStream(filePath)
      filedata.path = filePath
      filedata.filename = filename
      filedata.fieldname = name
      filedata.encoding = encoding
      filedata.mimeType = mimeType

      // Ensure we resolve only after the write stream finishes
      fileWritePromise = new Promise<void>((fileResolve, fileReject) => {
        file.pipe(ws)
        ws.on('finish', fileResolve)
        ws.on('error', fileReject)
        file.on('error', fileReject)
      })
    })

    busb.on('field', (name: string, value: string, info: any) => {
      fields[name] = value
    })

    busb.on('close', async () => {
      try {
        if (fileWritePromise) {
          await fileWritePromise
        }
        resolve({
          uploaded: filedata.path,
          path: fields.path,
          filename: fields.filename
        })
      } catch (err) {
        reject(err)
      }
    })

    request.pipe(busb)
  })
}
