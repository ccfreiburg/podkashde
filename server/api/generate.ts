import { defineEventHandler, useQuery } from "h3";
import { generateFeed, readPodcast } from "../services/podcastService";

export default defineEventHandler( async (event) => {
    const query = useQuery(event);
    const podcast = await readPodcast(query)
    generateFeed(podcast)
  });
  