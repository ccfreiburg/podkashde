import { getEpisode } from "../db/entities/Episode";
import { returnCodeReject, returnCodeResolve } from "../returncode";
import { migrateEpisodes } from "../services/wpimportService";

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
