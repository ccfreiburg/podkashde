import { returnCode } from "~~/backend/server/returncode";
import fs from "fs";
import { createDir, nuxtPath } from "~~/backend/server/podcast";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  return new Promise(async (resolve, reject) => {
    const data: Blob = await $fetch(body.orgurl, { responseType: "blob" });
    const path = nuxtPath(body.newpath);
    const filename = path + "/" + body.newfile;
    if (fs.existsSync(filename))
      resolve(returnCode(423, "File already exists"));
    else {
      createDir(path);
      const buffer = Buffer.from(await data.arrayBuffer());
      fs.writeFile(filename, buffer, (err) => {
        if (err) reject(returnCode(500, err.message));
        resolve(returnCode(201, "Fetched file successfully"));
      });
    }
  });
});
