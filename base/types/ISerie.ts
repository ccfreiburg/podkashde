import { ContentState } from "./ContentState";
import IEpisode from "./IEpisode";

export default interface ISerie {
  id?: number;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  cover_file: string;
  state: number;
  draft: boolean;
  firstEpisode?: Date;
  lastEpisode?: Date; 
  external_id?: number;
  lastbuild?: string;
  episodes?: Array<IEpisode>;
}

export function emptyISerieFactory(): ISerie {
  var serie: ISerie = {
    cover_file: '',
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    state: ContentState.draft,
    draft: false,
    lastbuild: '',
    external_id: -1,
    firstEpisode: null,
    lastEpisode: null 
  };
  return serie;
}
