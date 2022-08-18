import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from '~~/base/Constants';
import IEpisode from './types/IEpisode';
import IValidationError from './types/IValidationError';

function nonEmpty(fields: IEpisode, key: string, errors: Array<IValidationError>) {
  if (fields[key].length < 1) errors.push({ field: key, text: key });
}

export default function validation(
  fields: IEpisode,
  imgWidth: number,
  imgHeight: number
): Array<IValidationError> {
  var errors = [];
  if ( !(imgWidth == REQUIRED_IMG_WIDTH && imgHeight == REQUIRED_IMG_HEIGHT))
    errors.push({
      field: 'img',
      text: 'img',
    });
  nonEmpty(fields, 'title', errors);
  nonEmpty(fields, 'creator', errors);
  nonEmpty(fields, 'duration', errors);
  return errors;
}
