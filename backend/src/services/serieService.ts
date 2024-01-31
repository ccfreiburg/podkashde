import Serie from "../entities/Serie"
import { getQueryGen, updateGen } from "./genericService"

export const setLastAndFirst = async ( id: number ) : Promise<string> => {
    const serie = await getQueryGen(Serie, { id: id })
    var minmax = serie.episodes?.reduce( (minmax, episode) => {
      const d = new Date(episode.pubdate)
      if (d< minmax.min)
        minmax.min = d
      if (d > minmax.max)
        minmax.max = d
      return minmax
    }, { min: new Date(), max: new Date(1900)})
    serie.lastEpisode = minmax?.max
    serie.firstEpisode = minmax?.min
    updateGen(Serie, serie as Serie)
    return serie.slug
  }

  
export function getSerie(from: any): Serie {
    var serie = new Serie();
    serie.cover_file = from.cover_file;
    serie.title = from.title;
    serie.slug = from.slug;
    serie.subtitle = from.subtitle;
    serie.state = from.state;
    serie.draft = from.draft;
    serie.firstEpisode = from.firstEpisode;
    serie.lastEpisode = from.lastEpisode;
    if (from.hasOwnProperty("id")) serie.id = from.id;
    if (from.hasOwnProperty("external_id")) serie.external_id = from.external_id;
    if (from.hasOwnProperty("description")) serie.description = from.description;
    return serie;
  }