import { e } from 'vitest/dist/index-ea17aa0c';
import IEpisode from '../../base/types/IEpisode';
import getDataSource from '../db/dbsigleton';
import Episode, { getEpisode, joinEpisodePodcastAndSerie } from '../db/entities/Episode';
import Podcast from '../db/entities/Podcast';
import Serie from '../db/entities/Serie';

export async function migrateEpisode(episode: IEpisode, podcastId: number) {
  const db = await getDataSource();
  const serieRepo = db.getRepository(Serie);
  const podcastRepo = db.getRepository(Podcast);

   const getPodcast = async () => {
    if (podcastId>0)
    return await podcastRepo.findOne({
      where: { id: podcastId },
    });
  else
      return await podcastRepo.findOne({
        where: { external_id: episode.ext_podcast_id },
      });
    }
    
  const podcast = await getPodcast()
  const serie = await serieRepo.findOne({
    where: { external_id: episode.ext_series_id },
    relations: ['episodes']
  });
  var episodeToSave = getEpisode(episode);

  joinEpisodePodcastAndSerie(episodeToSave,podcast,serie)
  
  await db.manager.save(episodeToSave);
  if (serie)
    await db.manager.save(serie);
  if (podcast) 
    await db.manager.save(podcast);
}
