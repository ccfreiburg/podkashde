import { readEpisode } from "../services/episodeService";

export default defineEventHandler((event) => {
  const query = useQuery(event);
  return readEpisode(query);
});

