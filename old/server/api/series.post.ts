import getDataSource from "../db/dbsigleton";
import { getSerie } from "../db/entities/Serie";
import { returnCodeReject, returnCodeResolve } from "../returncode";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const db = await getDataSource();
    db.manager.save(body.map((item) => getSerie(item)));
    return returnCodeResolve(201, "Saved series successfully");
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
