import { REQUIRED_IMG_WIDTH, REQUIRED_IMG_HEIGHT } from './Constants';
import IValidationError from './types/IValidationError';
import ISerie from "./types/ISerie";
import serie_validation from "./SeriesDetailValidation"
import podcast_validation from "./PodcastDetailValidation"
import episode_validation from "./EpisodeDetailValidation"

export default function validation<T>(
  fields: Partial<T>,
  type: "podcast" | "serie" | "episode",
  imgWidth: number,
  imgHeight: number
): Array<IValidationError> {
  var errors = [] as Array<IValidationError>;
  switch(type) {
    case "serie": {
      return serie_validation(fields,imgWidth,imgHeight)
    }
    case "podcast": {
      return podcast_validation(fields,imgWidth,imgHeight)
    }
    case "episode": {
      return episode_validation(fields,imgWidth,imgHeight)
    }
    default: 
      return errors;
  }
}
