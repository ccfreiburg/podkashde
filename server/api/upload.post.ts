import multer from "multer";
import Podcast from "~~/backend/entities/Podcast";
import { moveUploadedImage, returnCode } from "~~/backend/server/podcast";

const upload = multer({ dest: "upload/" });
const coverParser = upload.single("cover");

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    coverParser(event.req, event.res, () => {
      try {
        if (!moveUploadedImage(event.req["file"]))
          reject(returnCode(500, "No File found"));
        resolve(returnCode(201, "File uploaded"));
      } catch (err) {
        reject(returnCode(500, err.message));
      }
    });
  });
});
