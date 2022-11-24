import getDataSource from "../db/dbsigleton";
import { getEnumerator } from "../db/entities/Enumerator";
import { returnCodeReject, returnCodeResolve } from "../returncode";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const db = await getDataSource();
    db.manager.save(body.map((item) => getEnumerator(item)));
    return returnCodeResolve(201, "Enum saved");
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
