import * as fs from 'fs';
import fetch from 'node-fetch'
import { createDir, dataPath } from '../tools/DataFiles';
export interface IFetchFileResult {
    statusCode: number,
    message: string,
    path?: string
}
    
export async function getFileFromUrl( orgUrl: string, toPath: string, altPath: string, toFile: string) : Promise<IFetchFileResult> {
  return new Promise(async (resolve, reject) => {
    const path = dataPath(toPath);
    const altpath = dataPath(altPath);
    const filename = path + '/' + toFile;
    const alternative = altpath + '/' + toFile;
    if (fs.existsSync(filename))
      resolve({
        statusCode: 423,
        message: 'File already exists',
        path: filename,
      });
    else if (
      altPath &&
      altPath.length > 0 &&
      fs.existsSync(alternative)
    ) {
      resolve({
        statusCode: 423,
        message: 'File already exists',
        path: alternative,
      });
    } else {
      try {
        createDir(path);
        const data = await fetch(orgUrl)
        const buffer = Buffer.from(await data.arrayBuffer());
        fs.writeFileSync(filename, buffer);
      } catch (err) {
        resolve({ statusCode: 400, message: err.message });
        return;
      }
      resolve({
        statusCode: 201,
        message: 'File fetched',
        path: filename,
      });
    }
  });
}