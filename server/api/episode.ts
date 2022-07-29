import { readEpisode } from "../services/episode";

export default defineEventHandler((event) => {
  const query = useQuery(event);
  return readEpisode(query);
});

