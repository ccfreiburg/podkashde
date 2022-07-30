import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '~~/base/Constants';
import IPodcast from './types/IPodcast';

function nonEmpty(fields: IPodcast, key: string, errors: Array<Object>) {
  if (fields[key].length < 1) errors.push({ field: key, text: key });
}

function selectionEmpty(fields: IPodcast, key: string, errors: Array<Object>) {
  if (fields[key + '_id'] < 0) errors.push({ field: key, text: key });
}

function email(fields: IPodcast, errors: Array<Object>) {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (fields.owner_email.length < 1 || re.test(fields.owner_email) == false)
    errors.push({
      field: 'owner_email',
      text: 'owner_email',
    });
}
function link(fields: IPodcast, errors: Array<Object>) {
  var re =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  if (fields.link.length < 1 || re.test(fields.link) == false)
    errors.push({ field: 'link', text: 'link' });
}

export default function validation(
  fields: IPodcast,
  imgWidth: number,
  imgHeight: number
): Array<string> {
  var errors = [];
  if (
    !(imgWidth == REQUIRED_IMG_WIDTH && imgHeight == REQUIRED_IMG_HEIGHT) ||
    fields.cover_file.length < 1
  )
    errors.push({
      field: 'img',
      text: 'img',
    });
  nonEmpty(fields, 'title', errors);
  nonEmpty(fields, 'author', errors);
  selectionEmpty(fields, 'language', errors);
  selectionEmpty(fields, 'category', errors);
  selectionEmpty(fields, 'type', errors);
  nonEmpty(fields, 'owner_name', errors);
  email(fields, errors);
  link(fields, errors);
  return errors;
}
