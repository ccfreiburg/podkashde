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

export async function generateRssAction(request: Request, response: Response) {
    try {
      const slug = request.query.slug as string;
      const baseUrl = process.env.podcastRssUrl ?? request.query.mediaBase as string
      const podcast = await getExtQueryGen(Podcast, { 
        where: {
            slug
        }, 
        relations: ["episodes"]
      }) as Podcast


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
