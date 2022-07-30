import { defineEventHandler, useQuery } from "h3";
import { readPodcast } from "../services/podcastService";

export default defineEventHandler((event) => {
    const query = useQuery(event);
    return readPodcast(query);
  });
  