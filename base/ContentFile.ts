import url from "url";
import { API_BASE, MEDIA_BASE } from "./Constants";

export class ContentFile {
  public static isQualifiedUrl(target: string): Boolean {
    if (target && target.length > 0) {
      return target.startsWith("http://") || target.startsWith("https://");
    }
    return false;
  }
  
  public static getPathFromUrl(
    serverPath: string,
    slug: string
  ): string {
    return serverPath + slug;
  }

  public static getFilename(target: string): string {
    return target.split("/").slice(-1)[0];
  }

  public static getMediaUrl(path: string): string {
    return MEDIA_BASE + path ;
  }

}
