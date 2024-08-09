import { UPLOAD_AP } from "~/base/Constants";
import { getSaveFilename } from "~/base/Converters";

function getFileInFormData(fileObj: File, path: string): FormData {
    const fd = new FormData();
    if (fileObj) {
        fd.append("cover", fileObj, fileObj.name);
        fd.append("filename", getSaveFilename(fileObj.name));
        fd.append("path", path)
    }
    return fd;
}

export default function useUploader() {
    return async function upload(server_path: string, fileObj: File | undefined) {
        var linkToContent = "";
        var result = {};

        if (fileObj) {
            var postData = {
                method: "post",
                body: getFileInFormData(fileObj, server_path)
            };
            const myFetch = useFetchApi()

            result = await myFetch(UPLOAD_AP, postData) as any;
        }
        if ((result as any).statusCode == 201 && fileObj) {
            linkToContent = server_path + "/" + getSaveFilename(fileObj.name);
        }
        return {
            link: linkToContent,
            result: result,
            nothingToDo: !fileObj,
        }
    }
}