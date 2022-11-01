import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from './Constants';
import ISerie from './types/ISerie';
import IValidationError from './types/IValidationError';

const i18nstructure = "serie.validation.";

function nonEmpty(fields: Partial<ISerie>, key: string, errors: Array<IValidationError>) {
  if (!fields[key] || fields[key].length < 1) errors.push({ field: key, text: i18nstructure+key });
}


export default function validation(
  fields: Partial<ISerie>,
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
  nonEmpty(fields, 'slug', errors);
  return errors;
}
