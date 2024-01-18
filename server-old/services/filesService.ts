
import fs from 'fs';
import { DATA_PATH } from '~~/base/Constants';

export const nuxtPath = (path: string) : string => {
  return DATA_PATH + path;
};

export const createDir = (dir: string) : void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const moveFile = function (fullpath: string, newpath : string, filename: string) {
  var dir = nuxtPath(newpath);
  createDir(dir);
  const target_path = dir + '/' + filename;
  fs.renameSync(fullpath, target_path);
  return true;
};

export const copyFile = function (fullpath: string, newpath : string, filename: string) {
  var dir = nuxtPath(newpath);
  createDir(dir);
  const target_path = dir + '/' + filename;
  fs.copyFileSync(fullpath, target_path);
  return true;
};