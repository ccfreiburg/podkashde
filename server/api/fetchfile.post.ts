import fs from "fs";
import { returnCode } from "../returncode";
import { createDir, nuxtPath } from "../services/podcastService";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  return new Promise(async (resolve, reject) => {
    const path = nuxtPath(body.newpath);
    const altpath = nuxtPath(body.altpath);
    const filename = path + "/" + body.newfile;
    const alternative = altpath + "/" + body.newfile;
    if (fs.existsSync(filename))
      resolve({
        status: 423,
        message: "File already exists",
        path: body.newpath + "/" + body.newfile
      })
    else if (body.altpath && body.altpath.length>0 && fs.existsSync(alternative)) {
      resolve({
        status: 423,
        message: "File already exists",
        path: body.altpath + "/" + body.newfile
      })
    } else {
      try {
      createDir(path);
      const data: Blob = await $fetch(body.orgurl, { responseType: "blob" });
      const buffer = Buffer.from(await data.arrayBuffer());
      fs.writeFileSync(filename, buffer)
      } catch (err){
        resolve(returnCode(400, err.message));
        return;
      }
      resolve({
        status: 201,
        message: "File fetched",
        path: body.newpath+ "/" + body.newfile

      });
    }
  });
});
