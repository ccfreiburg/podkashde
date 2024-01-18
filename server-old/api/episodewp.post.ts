import { returnCodeReject, returnCodeResolve } from "../returncode";
import { saveNewEpisode, updateEpisode } from "../services/episodeService";
import { isUpdate } from "../services/podcastService";
import { migrateEpisode } from "../services/wpMigrationService";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    await migrateEpisode(data.episode, (data.podcastId?data.podcastId:0))
  } catch (err) {
    console.log(err);
    return returnCodeReject(500, err.message);
  }
  return returnCodeResolve(201, "Podcast saved");
});
