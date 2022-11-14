import fs from 'fs';
import getDataSource from '~~/server/db/dbsigleton';
import Podcast, { setPodcast } from '~~/server/db/entities/Podcast';
import IPodcast from '~~/base/types/IPodcast';
import { DATA_PATH, FEED_SLUG } from '~~/base/Constants';
import { FindAllBy } from '@testing-library/vue';
import { FindManyOptions } from 'typeorm';
import Enumerator from '../db/entities/Enumerator';
import Enumerations from '~~/base/Enumerations';
import { generateRss } from '~~/base/RssGenerator';

export const readPodcasts = async function (): Promise<Array<IPodcast>> {
  const db = await getDataSource();
  const repo = db.getRepository(Podcast);
  return await repo.find();
};

export const readPodcast = async function (query: Partial<IPodcast>): Promise<IPodcast> {
  const db = await getDataSource();
  const repo = db.getRepository(Podcast);
  var tmpQuery : FindManyOptions<Podcast> = {
    where: query,
    relations: ['episodes', 'series'],
  };
  var result: Array<IPodcast> = await repo.find(tmpQuery);
  return result.pop() as IPodcast
};

export const generateFeed = async (podcast: IPodcast) => {
  const db = await getDataSource();
  const repo = db.getRepository(Enumerator);
  const enums = await repo.find();
  const enumFuncs = {
    getLanguage: (id:number) => Enumerations.byIdOne(Enumerations.languages(enums), id),
    getGenre: (id:number) => Enumerations.byIdOne(Enumerations.podcastGenres(enums), id),
    getType: (id:number) => Enumerations.byIdOne(Enumerations.podcastTypes(enums), id),
  }
  const xml = generateRss(podcast, enumFuncs)
  var dir = nuxtPath(FEED_SLUG);
  createDir(dir);
  const target_file = dir + "/" + podcast.slug+".xml"
  fs.writeFileSync(target_file, xml)
}

export const nuxtPath = (path: string) : string => {
  return DATA_PATH + path;
};

export const createDir = (dir: string) : void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const moveUploadedImage = function (path : string, imageFile: any) {
  if (!imageFile) return false;
  const upload_path = imageFile.path;
  var dir = nuxtPath(path);
  createDir(dir);
  const target_path = dir + '/' + imageFile.originalname;
  fs.renameSync(upload_path, target_path);
  return true;
};

export const isUpdate = function (podcastObject: IPodcast): Boolean {
  if (!podcastObject) return false;
  var isupdate: Boolean = 'id' in podcastObject;
  if (isupdate) isupdate = podcastObject.id as number > 0;
  return isupdate;
};

export const saveNewPodcast = async function (
  podcastObject: IPodcast
): Promise<IPodcast> {
  var podcast = setPodcast(new Podcast(), podcastObject);
  const db = await getDataSource();
  await db.manager.save(podcast);
  return podcast;
};

export const updatePodcast = async function (podcastObject : IPodcast) {
  const db = await getDataSource();
  await db.manager.update(Podcast, podcastObject.id, podcastObject);
};
