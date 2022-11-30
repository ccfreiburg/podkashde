import { moveUploadedImage } from '~~/server/services/podcastService';
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
      const { filename, encoding, mimeType } = info
      const path = UPLOAD_TEMP_PATH+filename;
      console.log("WRITING to "+path)
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
      console.log(name + " " + value)
    })
    busboy.on('close', () => {
      console.log("finish")
      resolve({ uploaded: filedata.path, path: fields.path, filename: filedata.filename })
    })
    req.pipe(busboy)
    return
  })
}

export default defineEventHandler( async (event) => {
  try {
    const { filename, path, uploaded } = await paseFormdata(event.node.req)
    if (moveUploadedImage(uploaded, path, filename))
      return returnCode(201)
  } catch (err) {
    sendError(event, createError({statusCode: 500, statusMessage: err.message}));
  }
  sendError(event, createError({statusCode: 500, statusMessage: 'No File found'}));
});
