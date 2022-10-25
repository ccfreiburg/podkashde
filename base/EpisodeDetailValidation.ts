import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '../base/Constants';
import IEpisode from './types/IEpisode';
import IValidationError from './types/IValidationError';

const i18naccessor = "episodeDetail.validation."

function nonEmpty(fields: Partial<IEpisode>, key: string, errors: Array<IValidationError>) {
  if (!fields[key] || fields[key].length < 1) errors.push({ field: key, text: i18naccessor+key });
}

export default function validation(
  fields: Partial<IEpisode>,
  imgWidth: number,
  imgHeight: number
): Array<IValidationError> {
  var errors = [];
  if ( !(imgWidth == REQUIRED_IMG_WIDTH && imgHeight == REQUIRED_IMG_HEIGHT))
    errors.push({
      field: 'img',
      text: i18naccessor+'img',
    });
  nonEmpty(fields, 'title', errors);
  nonEmpty(fields, 'creator', errors);
  nonEmpty(fields, 'slug', errors);
  return errors;
}
