import Enumerator from "../entities/Enumerator";
import Podcast from "../entities/Podcast";
import { createDir, dataPath, writeRss } from "../tools/DataFiles";
import Enumerations from "../tools/Enumerations";
import { generateRss } from "../tools/RssGenerator";
import getRepository from "./datasourceService";
import { getQueryGen, updateGen } from "./genericService";

export function getPodcast(from : any): Podcast {
    var podcast = new Podcast();
    if (!from) return podcast;
    if ('id' in from) podcast.id = from.id;
    podcast.cover_file = from.cover_file;
    podcast.title = from.title;
    podcast.slug = from.slug;
    podcast.subtitle = from.subtitle;
    podcast.author = from.author;
    podcast.summary = from.summary;
    podcast.description = from.description;
    podcast.language_id = from.language_id;
    podcast.category_id = from.category_id;
    podcast.type_id = from.type_id;
    podcast.explicit = from.explicit;
    podcast.link = from.link;
    podcast.draft = from.draft;
    podcast.copyright = from.copyright;
    podcast.owner_name = from.owner_name;
    podcast.owner_email = from.owner_email;
    if (from.hasOwnProperty('state')) podcast.state = from.state;
    if (from.hasOwnProperty('lastbuild')) podcast.lastbuild = from.lastbuild;
    if (from.hasOwnProperty('external_id'))
      podcast.external_id = from.external_id;
    if (from.hasOwnProperty('apple_url'))
      podcast.apple_url = from.apple_url;
    if (from.hasOwnProperty('spotify_url'))
      podcast.spotify_url = from.spotify_url;
    if (from.hasOwnProperty('google_url'))
      podcast.google_url = from.google_url;
    if (from.hasOwnProperty('stitcher_url'))
      podcast.stitcher_url = from.stitcher_url;
    return podcast;
  }

  export const setLastUpdate = async ( id: number ) : Promise<string> => {
    const podcast = await getQueryGen(Podcast, { id: id })
    podcast.lastbuild = Date.now().toLocaleString()
    podcast.updatedAt = Date.now()
    updateGen(Podcast, podcast as Podcast)
    return podcast.lastbuild
  }

  
//   if (object.hasOwnProperty("updatedAt"))
//   (object as any).updatedAt = new Date();