import { readEpisodes } from "../services/episode";

export default defineEventHandler((event) => {
  const query = useQuery(event);
  return readEpisodes(query);
});

