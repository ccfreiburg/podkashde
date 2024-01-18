import { defineEventHandler, getQuery } from "h3";
import { readPodcast } from "../services/podcastService";

export default defineEventHandler((event) => {
    const query = getQuery(event);
    return readPodcast(query);
  });
  