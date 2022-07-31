import { returnCodeReject, returnCodeResolve } from "../returncode";
import { saveNewEpisode, updateEpisode } from "../services/episodeService";
import { isUpdate } from "../services/podcastService";

export default defineEventHandler(async (event) => {
  try {
    const data = await useBody(event);
    console.log(data);
    if (isUpdate(data)) {
      await updateEpisode(data);
    } else {
      await saveNewEpisode(data);
    }
  } catch (err) {
    console.log(err);
    return returnCodeReject(500, err.message);
  }
  return returnCodeResolve(201, "Podcast saved");
});
