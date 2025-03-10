import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '../base/Constants';
import type {IPodcast} from './types/IPodcast';
import type {IValidationError} from './types/IValidationError';

const i18nstructure = "podcast.validation.";

function nonEmpty(fields: Partial<IPodcast>, key: string, errors: Array<IValidationError>) {
  if (!fields[key] || fields[key].length < 1) errors.push({ field: key, text: i18nstructure+key });
}

function selectionEmpty(fields: Partial<IPodcast>, key: string, errors: Array<IValidationError>) {
  if (!fields[key + '_id'] || fields[key + '_id'] < 0) errors.push({ field: key, text: i18nstructure+key });
}

function email(fields: Partial<IPodcast>, errors: Array<IValidationError>) {
  var re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!fields["owner_email"] || fields.owner_email.length < 1 || re.test(fields.owner_email) == false)
    errors.push({
      field: 'owner_email',
      text: i18nstructure+'owner_email',
    });
}
function link(fields: Partial<IPodcast>, key: string, errors: Array<IValidationError>, emptyallowed: boolean = false) {
  if (!fields[key] || fields[key].length==0 && emptyallowed)
    return
  var re =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  if (!fields[key] || fields[key].length < 1 || re.test(fields[key]) == false)
    errors.push({ field: key, text: i18nstructure+key });
}

export default function validation(
  fields: Partial<IPodcast>,
  imgWidth: number,
  imgHeight: number
): Array<IValidationError> {
  var errors = [] as Array<IValidationError>;
  if (
    !(imgWidth == REQUIRED_IMG_WIDTH && imgHeight == REQUIRED_IMG_HEIGHT) ||
    !fields['cover_file'] || fields.cover_file.length < 1
  )
    errors.push({
      field: 'img',
      text: i18nstructure+'img',
    });
  nonEmpty(fields, 'title', errors);
  nonEmpty(fields, 'author', errors);
  nonEmpty(fields, 'slug', errors);
  nonEmpty(fields, 'owner_name', errors);
  selectionEmpty(fields, 'language', errors);
  selectionEmpty(fields, 'category', errors);
  selectionEmpty(fields, 'type', errors);
  email(fields, errors);
  link(fields, 'link', errors);
  link(fields, 'apple_url', errors, true);
  link(fields, 'spotify_url', errors, true);
  link(fields, 'google_url', errors, true);
  link(fields, 'stitcher_url', errors, true);
  return errors;
}
