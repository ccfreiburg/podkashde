import IEpisode from "./IEpisode";

export default class AudioFileMetadata {
    selectedFile = null;
    duration = 0;
    size = 0;
    imgblob: Blob|undefined = undefined;
    cover_preview = "";
    fields: Partial<IEpisode> = {};
  }
  