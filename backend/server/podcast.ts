import fs from "fs";
import getDataSource from "~~/backend/dbsigleton";
import Podcast, { getPodcast, setPodcast } from "~~/backend/entities/Podcast";
import { SERVER_IMG_PATH } from "~~/backend/Constants";

export const returnCode = function (
  statuscode: number,
  textmessage: string
): Object {
  return {
    status: statuscode,
    message: textmessage,
  };
};

export const returnCodeReject = function (
  statuscode: number,
  textmessage: string
): Promise<Object> {
  return Promise.reject({
    status: statuscode,
    message: textmessage,
  });
};
export const returnCodeResolve = function (
  statuscode: number,
  textmessage: string
): Promise<Object> {
  return Promise.resolve({
    status: statuscode,
    message: textmessage,
  });
};

export const readPodcast = async function (query): Promise<Array<Podcast>> {
  const db = await getDataSource();
  const repo = db.getRepository(Podcast);
  if (query.id || query.slug) {
    var tmpQuery = {
      where: query,
      relations: ["episodes"],
    };
    return await repo.find(tmpQuery);
  } else return await repo.find();
};

export const moveUploadedImage = function (imageFile) {
  if (!imageFile) return false;
  const upload_path = imageFile.path;
  const target_path = SERVER_IMG_PATH + imageFile.originalname;
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
