import multer from 'multer';
import { moveUploadedImage } from '~~/server/services/podcastService';
import { returnCode } from '~~/server/returncode';
import { UPLOAD_TEMP_PATH } from '~~/base/Constants';

const upload = multer({ dest: UPLOAD_TEMP_PATH });
const coverParser = upload.single('cover');

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    coverParser(event.req, event.res, () => {
      try {
        if (!moveUploadedImage(event.req['body']['path'], event.req['file']))
          reject(returnCode(500, 'No File found'));
        resolve(returnCode(201, 'File uploaded'));
      } catch (err) {
        reject(returnCode(500, err.message));
      }
    });
  });
});
