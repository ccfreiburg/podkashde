import * as fs from 'fs';
import * as path from 'path'
import { DATA_PATH } from './Configuration';

export const dataPath = (path: string) : string => {
  return DATA_PATH + path;
};

export const createDir = (dir: string) : void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const moveFile = function (fullpath: string, newpath : string, filename: string) {
  var dir = dataPath(newpath);
  createDir(dir);
  const target_path = dir + '/' + filename;
  fs.renameSync(fullpath, target_path);
  return true;
};

export const copyFile = function (fullpath: string, newpath : string, filename: string) {
  var dir = dataPath(newpath);
  createDir(dir);
  const target_path = dir + '/' + filename;
  fs.copyFileSync(fullpath, target_path);
  return true;
};

export const writeRss = function(feedSlug: string, podcastSlug: string, xml: string) {
    var dir = dataPath(feedSlug);
    createDir(dir)
    const target_file = dir + podcastSlug+".xml"
    fs.writeFileSync(target_file, xml)
}

export const getFilename = function(target: string) {
    return target.split("/").slice(-1)[0];
}


export function findFile(name: string, path: string) : string {
  const dirs = [path]
  while (dirs.length>0) {
    const currentDir = dirs.pop()
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (!(fs.lstatSync(`${currentDir}/${item}`)).isDirectory()) {
          if (item===name) 
            return `${currentDir}/${item}`
        } else
          dirs.push(`${currentDir}/${item}`)
      }
  }
  return ""
}