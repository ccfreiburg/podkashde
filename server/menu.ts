import fs from 'fs'
import { DATA_PATH } from '~~/base/Constants';
export default function getSettings() {
  const data = fs.readFileSync(DATA_PATH + '/menu.json',{encoding:'utf8', flag:'r'});
  return JSON.parse(data);
}
