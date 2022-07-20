import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from "~~/backend/Constants";
import Episode from "./entities/Episode";

function nonEmpty(fields: Episode, key: string, errors: Array<Object>) {
  if (fields[key].length < 1) errors.push({ field: key, text: key });
}

export default function validation(
  fields: Episode,
  imgWidth: number,
  imgHeight: number
): Array<string> {
  var errors = [];
  if (
    !(imgWidth == REQUIRED_IMG_WIDTH && imgHeight == REQUIRED_IMG_HEIGHT) ||
    fields.image.length < 1
  )
    errors.push({
      field: "img",
      text: "img",
    });
  nonEmpty(fields, "title", errors);
  nonEmpty(fields, "creator", errors);
  nonEmpty(fields, "duration", errors);
  return errors;
}
