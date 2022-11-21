import { defineEventHandler, getQuery } from "h3";
import { readSerie } from "../services/serieService";

export default defineEventHandler((event) => {
    const query = getQuery(event);
    return readSerie(query);
  });
  