import { createDir, moveFile } from '~~/server/services/filesService';
import { returnCode } from '~~/server/returncode';
import { UPLOAD_TEMP_PATH } from '~~/base/Constants';
import Busboy from 'busboy'
import fs from 'fs'

async function paseFormdata(req: any) {
  return new Promise((resolve) => {
    var filedata = {} as any
    const fields = {} as any
    const busboy = Busboy({ headers: req.headers })
    busboy.on('file', (name: string, file: any, info: any) => {
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
    busboy.on('field', (name : string, value: object, info: any) => {
      fields[name] = value
    })
    busboy.on('close', () => {
      resolve({ uploaded: filedata.path, path: fields.path, filename: fields.filename })
    })
    req.pipe(busboy)
    return
  })
}

export default defineEventHandler( async (event) => {
  try {
    createDir(UPLOAD_TEMP_PATH)
    const { filename, path, uploaded } = await paseFormdata(event.node.req)
    if (moveFile(uploaded, path, filename))
      return returnCode(201)
  } catch (err) {
    sendError(event, createError({statusCode: 500, statusMessage: err.message}));
  }
  sendError(event, createError({statusCode: 500, statusMessage: 'No File found'}));
});
