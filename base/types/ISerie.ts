import { ContentState } from "./ContentState";

export default interface ISerie {
  id?: number;
  description: string;
  title: string;
  subtitle: string;
  slug: string;
  cover_file: string;
  state: number;
  external_id?: number;
  lastbuild?: string;
}

export function emptyISerieFactory(): ISerie {
  var serie: ISerie = {
    cover_file: '',
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    state: ContentState.draft,
    lastbuild: '',
    external_id: -1,
  };
  return serie;
}
