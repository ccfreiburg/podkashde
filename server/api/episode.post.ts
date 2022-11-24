import { returnCodeReject, returnCodeResolve } from "../returncode";
import { saveNewEpisode, updateEpisode } from "../services/episodeService";
import { isUpdate } from "../services/podcastService";
import { migrateEpisode } from "../services/wpMigrationService";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (isUpdate(data)) {
      await updateEpisode(data);
    } else {
      if (!data.podcast && data.external_id>-1) {
        await migrateEpisode(data)
      }
      else {
        await saveNewEpisode(data)
      }
    }
  } catch (err) {
    console.log(err);
    return returnCodeReject(500, err.message);
  }
  return returnCodeResolve(201, "Podcast saved");
});
