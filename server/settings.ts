import fs from 'fs'
import { DATA_PATH } from '~~/base/Constants';
export default function getSettings() {
  const data = fs.readFileSync(DATA_PATH + '/app.settings.json',{encoding:'utf8', flag:'r'});
  console.log(data)
  return JSON.parse(data);
}
