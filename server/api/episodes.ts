import { readEpisodes } from "../services/episodeService";

export default defineEventHandler((event) => {
  return readEpisodes();
});

