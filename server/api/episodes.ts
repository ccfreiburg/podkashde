import { readEpisodes } from "../services/episode";

export default defineEventHandler((event) => {
  return readEpisodes();
});

