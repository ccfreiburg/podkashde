import getDataSource from "~~/backend/dbsigleton";
import { getEnumerator } from "~~/backend/entities/Enumerator";
import {
  returnCodeReject,
  returnCodeResolve,
} from "~~/backend/server/returncode";

export default defineEventHandler(async (event) => {
  try {
    const body = await useBody(event);
    const db = await getDataSource();
    db.manager.save(body.map((item) => getEnumerator(item)));
    return returnCodeResolve(201, "Enum saved");
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
