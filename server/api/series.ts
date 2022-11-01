import { readSeries } from "../services/serieService";

export default defineEventHandler((event) => {
  return readSeries();
});

