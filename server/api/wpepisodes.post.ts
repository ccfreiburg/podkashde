import { getEpisode } from "~~/backend/entities/Episode";
import {
  returnCodeReject,
  returnCodeResolve,
} from "~~/backend/server/returncode";
import { migrateEpisodes } from "~~/backend/server/wpepisode";

export default defineEventHandler(async (event) => {
  try {
    const body = await useBody(event);
    var episodes = body.map((item) => getEpisode(item));
    if (episodes.length > 0) {
      migrateEpisodes(episodes);
      return returnCodeResolve(201, "Saved series successfully");
    } else {
      return returnCodeReject(500, "No Data");
    }
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
});
