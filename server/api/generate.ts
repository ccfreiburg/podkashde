import { defineEventHandler, getQuery } from "h3";
import { generateFeed, readPodcast } from "../services/podcastService";

export default defineEventHandler( async (event) => {
    const query = getQuery(event);
    const podcast = await readPodcast(query)
    generateFeed(podcast)
  });
  