import { isRegularExpressionLiteral } from "typescript";
import { SERVER_MP3_PATH } from "~~/base/Constants";
import { updateEpisode } from "../services/episodeService";
import { moveFile, nuxtPath } from "../services/filesService";
import { ContentFile } from "../../base/ContentFile"
export default defineEventHandler(async (event) => {
  const { episode, podcast, serie } = await readBody(event);
  if (!ContentFile.isQualifiedUrl(episode.link)) {
    const file = ContentFile.getFilename(episode.link)
    const newpath = SERVER_MP3_PATH + podcast.slug
    await moveFile(nuxtPath(episode.link), newpath, file)
    episode.link = newpath + '/' + file
  }
  episode.podcast = podcast
  episode.serie = serie

  return await updateEpisode(episode);
});


