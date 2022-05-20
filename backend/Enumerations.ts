import Enumerator from "./entities/Enumerator";

export enum EnumKey {
  Language = 0,
  PodcastGenres = 1,
  PodcastTypes = 2,
}

export class Enumerations {
  private list = [] as Array<Enumerator>;

  init(list: Array<Enumerator>) {
    this.list = list;
  }

  getEnumeration(enumKey: EnumKey): Array<Enumerator> {
    return this.list.filter((item) => item.enumkey_id === enumKey);
  }

  get isInitialized(): boolean {
    return this.list.length > 0;
  }

  get languages(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.Language);
  }
  get podcastGenres(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.PodcastGenres);
  }
  get podcastTypes(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.PodcastTypes);
  }
}
