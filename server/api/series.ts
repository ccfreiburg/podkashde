import { readSeries } from "../services/serieService";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  return readSeries(query);
});

