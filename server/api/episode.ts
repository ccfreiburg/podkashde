import { readEpisode } from "../services/episodeService";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  return readEpisode(query);
});

