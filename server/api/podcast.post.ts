import {
  isUpdate,
  saveNewPodcast,
  updatePodcast,
} from '~~/server/services/podcastService';
import { returnCodeReject, returnCodeResolve } from '~~/server/returncode';
import IPodcast from '~~/base/types/IPodcast';

export default defineEventHandler(async (event) => {
  try {
    console.log(event)
    const data: IPodcast = await useBody(event);
    if (isUpdate(data)) {
      await updatePodcast(data);
    } else {
      await saveNewPodcast(data);
    }
  } catch (err) {
    return returnCodeReject(500, err.message);
  }
  return returnCodeResolve(201, 'Podcast saved');
});
