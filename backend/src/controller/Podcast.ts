import * as fs from 'fs';
import { Request, Response } from "express";
import { respond } from "../tools/Controller";
import { getAllGen, getExtQueryGen } from "../services/genericService";
import Podcast from "../entities/Podcast";
import Enumerator from "../entities/Enumerator";
import { getEnumFunctions } from "../tools/Enumerations";
import { generateRss } from "../tools/RssGenerator";
import { FEED_SLUG } from "../tools/Configuration";
import { createDir, dataPath } from "../tools/DataFiles";

function getBase(request: Request) {
  const url = new URL(request.url, `http://${request.headers.host}`); 
  return url.origin
}

export async function generateRssAction(request: Request, response: Response) {
    try {
      const query = request.params;
      const podcast = await getExtQueryGen(Podcast, { where: query, relations: ["episodes"]}) as Podcast
      const baseUrl = process.env.podcastRssUrl || getBase(request)


      const enums = await getAllGen(Enumerator) as Array<Enumerator>

      const xml = generateRss(podcast, baseUrl, FEED_SLUG, getEnumFunctions(enums) )

      var dir = dataPath(FEED_SLUG);
      createDir(dir)
      const target_file = dir + podcast.slug+".xml"
      fs.writeFileSync(target_file, xml)
      respond(response, 201, { message: "RSS for podcast slug=" + podcast.slug + " successfully generated" });
    } catch (error) {
      respond(response, 500, {
        statusCode: 500,
        statusMessage: "Internal server error"})
    }
}
