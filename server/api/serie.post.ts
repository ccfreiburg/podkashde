import getDataSource from "../db/dbsigleton";
import { getSerie } from "../db/entities/Serie";
import { returnCodeReject, returnCodeResolve } from "../returncode";
import { setLastAndFirst, updateSerie } from "../services/serieService";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (body.hasOwnProperty('id')) {
      if (body.hasOwnProperty('title')) {
        updateSerie(body)
        return returnCodeResolve(201, "Saved series successfully");
      } else {
        return setLastAndFirst(body.id)
      }
    } else
    return returnCodeReject(501, "nd data");
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
