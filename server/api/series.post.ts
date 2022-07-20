import getDataSource from "~~/backend/dbsigleton";
import { getSerie } from "~~/backend/entities/Serie";
import {
  returnCodeReject,
  returnCodeResolve,
} from "~~/backend/server/returncode";

export default defineEventHandler(async (event) => {
  try {
    const body = await useBody(event);
    const db = await getDataSource();
    db.manager.save(body.map((item) => getSerie(item)));
    return returnCodeResolve(201, "Saved series successfully");
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
