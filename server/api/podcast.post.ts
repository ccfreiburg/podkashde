import multer from "multer";
const upload = multer({ dest: "upload/" });
const coverParser = upload.single("cover");

export default defineEventHandler( async (event) => {
    await coverParser(event.req, event.res, () => {
            console.log(event.req["body"]);
            console.log(event.req["file"].path);
            });
    return {
            status: 201,
            message: "uploaded podcast meta data"
    };
});