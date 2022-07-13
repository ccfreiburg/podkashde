import { readPodcast } from "~~/backend/server/podcast";

export default defineEventHandler(async (event) => {
  const query = useQuery(event);
  return await readPodcast(query);
});
