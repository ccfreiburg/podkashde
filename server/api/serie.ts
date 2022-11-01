import { defineEventHandler, useQuery } from "h3";
import { readSerie } from "../services/serieService";

export default defineEventHandler((event) => {
    const query = useQuery(event);
    return readSerie(query);
  });
  