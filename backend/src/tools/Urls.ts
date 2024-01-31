export function isQualifiedUrl(target: string): Boolean {
    if (target && target.length > 0) {
      return target.startsWith("http://") || target.startsWith("https://");
    }
    return false;
  }
  
  export function serverUrl( episodeLink: string, baseUrl: string ) : string {
    if (isQualifiedUrl(episodeLink))
      return episodeLink;
  
    return baseUrl + episodeLink;
  }
  