import getDataSource from "~~/backend/dbsigleton";
import { getPodcast } from "~~/backend/entities/Podcast";
import {
  returnCodeReject,
  returnCodeResolve,
} from "~~/backend/server/returncode";

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
