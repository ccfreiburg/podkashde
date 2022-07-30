import url from "url";

export class ContentFile {
  public static isQualifiedUrl(target: string): Boolean {
    if (target && target.length > 0) {
      return target.startsWith("http://") || target.startsWith("https://");
    }
    return false;
  }
  public static getPathFromUrl(
    serverPath: string,
    slug: string,
    target: string
  ): string {
    const url = new URL(target);
    return serverPath + slug;
  }

  public static getFilename(target: string): string {
    return target.split("/").slice(-1)[0];
  }
}
