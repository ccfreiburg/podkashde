import getDataSource from "../db/dbsigleton";
import { getPodcast } from "../db/entities/Podcast";
import { returnCodeReject, returnCodeResolve } from "../returncode";

export default defineEventHandler(async (event) => {
  try {
    const body = await useBody(event);
    const db = await getDataSource();
    await db.manager.save(body.map((item) => getPodcast(item)));
    return returnCodeResolve(201, "Podcast saved");
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
