import fs from "fs";
import getDataSource from "~~/backend/dbsigleton";
import Podcast, { getPodcast } from "~~/backend/entities/Podcast";

export const readPodcast = async function (query): Promise<Array<Podcast>> {
  const db = await getDataSource();
  const repo = db.getRepository(Podcast);
  if (query.id || query.slug) {
    var tmpQuery = {
      where: query,
      relations: ["episodes", "series"],
    };
    return await repo.find(tmpQuery);
  } else return await repo.find();
};

export const nuxtPath = (path) => {
  return "public" + path;
};

export const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const moveUploadedImage = function (path, imageFile) {
  if (!imageFile) return false;
  const upload_path = imageFile.path;
  var dir = nuxtPath(path);
  createDir(dir);
  const target_path = dir + "/" + imageFile.originalname;
  fs.renameSync(upload_path, target_path);
  console.log(target_path);
  return true;
};

export const isUpdate = function (podcastObject): Boolean {
  if (!podcastObject) return false;
  var isupdate: Boolean = "id" in podcastObject;
  if (isupdate) isupdate = podcastObject.id > 0;
  return isupdate;
};

export const saveNewPodcast = async function (podcastObject): Promise<Podcast> {
  var podcast = getPodcast(podcastObject);
  const db = await getDataSource();
  await db.manager.save(podcast);
  return podcast;
};

export const updatePodcast = async function (podcastObject) {
  const db = await getDataSource();
  await db.manager.update(Podcast, podcastObject.id, podcastObject);
};
