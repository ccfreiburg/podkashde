import type {IEpisode} from "./IEpisode";

export default class AudioFileMetadata {
    selectedFile?: File;
    duration = 0;
    size = 0;
    imgblob?: Blob;
    cover_preview?: string;
    fields: Partial<IEpisode> = {};
  }
  