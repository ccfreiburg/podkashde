import Episode from '../entities/Episode';
import Serie from '../entities/Serie';
import Podcast from '../entities/Podcast';
import { joinEpisodePodcastAndSerie } from './episodeService';
import { getByIdGen, getExtQueryGen, saveGen } from './genericService';

export async function migrateWpEpisode(episode: Episode, podcastId: number) : Promise<Episode> {

  const getRelation = async (T:any, id: number, externalId: number) => {
    if (id>0)
      return await getByIdGen(T, podcastId );
    else
      return await getExtQueryGen(T,{
        where: { external_id: externalId },
        relations: ['episodes']
      })[0]
  }
    
  const podcast = await getRelation(Podcast,podcastId,episode.ext_podcast_id)
  const serie = await getRelation(Serie,-1,episode.ext_series_id)

  joinEpisodePodcastAndSerie(episode,podcast,serie)
  
  const id = await saveGen<Episode>(Episode,episode);
  if (serie)
    await saveGen<Serie>(Podcast,serie);
  if (podcast) 
    await saveGen<Podcast>(Podcast,podcast);
  return { ...episode, id } as Episode
}

