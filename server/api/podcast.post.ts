import Podcast from "~~/backend/entities/Podcast";
import {
  isUpdate,
  saveNewPodcast,
  updatePodcast,
  returnCodeReject,
  returnCodeResolve,
} from "~~/backend/server/podcast";

export default defineEventHandler(async (event) => {
  try {
    const data = await useBody(event);
    if (isUpdate(data)) {
      await updatePodcast(data);
    } else {
      await saveNewPodcast(data);
    }
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
  return returnCodeResolve(201, "Podcast saved");
});
