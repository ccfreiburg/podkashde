import { readSeries } from "../services/serieService";

export default defineEventHandler((event) => {
  const query = useQuery(event);
  return readSeries(query);
});

