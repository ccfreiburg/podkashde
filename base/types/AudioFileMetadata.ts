import IEpisode from "./IEpisode";

export default class AudioFileMetadata {
    selectedFile = null;
    duration = 0;
    size = 0;
    cover_preview = "";
    fields: Partial<IEpisode> = {};
  }
  