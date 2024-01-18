import fs from 'fs';
import { IFetchFileResult } from '../../base/types/IFetchFileResult';
import { createDir, nuxtPath } from '../services/filesService';

export default defineEventHandler(async (event): Promise<IFetchFileResult> => {
  const body = await readBody(event);
  return new Promise(async (resolve, reject) => {
    const path = nuxtPath(body.newpath);
    const altpath = nuxtPath(body.altpath);
    const filename = path + '/' + body.newfile;
    const alternative = altpath + '/' + body.newfile;
    if (fs.existsSync(filename))
      resolve({
        status: 423,
        message: 'File already exists',
        path: body.newpath + '/' + body.newfile,
      });
    else if (
      body.altpath &&
      body.altpath.length > 0 &&
      fs.existsSync(alternative)
    ) {
      resolve({
        status: 423,
        message: 'File already exists',
        path: body.altpath + '/' + body.newfile,
      });
    } else {
      try {
        createDir(path);
        const data: Blob = await $fetch(body.orgurl, { responseType: 'blob' });
        const buffer = Buffer.from(await data.arrayBuffer());
        fs.writeFileSync(filename, buffer);
      } catch (err) {
        resolve({ status: 400, message: err.message });
        return;
      }
      resolve({
        status: 201,
        message: 'File fetched',
        path: body.newpath + '/' + body.newfile,
      });
    }
  });
});
