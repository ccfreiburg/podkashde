import Enumerator, { getEnumerator } from "./entities/Enumerator";

export enum EnumKey {
  Language = 0,
  PodcastGenres = 1,
  PodcastTypes = 2,
  State = 3,
  Authors = 4,
  Tags = 5,
}

export enum ContentState {
  metadata = 1,
  series = 2,
  episodes = 3,
  image = 4,
  files = 5,
  draft = 6,
  published = 7,
}

export class Enumerations {
  private list = [] as Array<Enumerator>;

  init(list: Array<Enumerator>) {
    this.list = list;
  }

  add(
    displaytext: string,
    shorttext: string,
    parentCategory: string,
    enumkey_id: number,
    enumvalue_id: number
  ) {
    this.list.push(
      getEnumerator({
        displaytext,
        shorttext,
        parentCategory,
        enumkey_id,
        enumvalue_id,
      })
    );
  }

  public addList(list: Array<Enumerator>) {
    list.forEach((item) => this.list.push(item));
  }

  getEnumeration(enumKey: EnumKey): Array<Enumerator> {
    return this.list.filter((item) => item.enumkey_id === enumKey);
  }

  get isInitialized(): boolean {
    return this.list.length > 0;
  }

  public static byIdTextList(
    enums: Array<Enumerator>,
    ids: Array<number>
  ): string {
    let result = enums
      .filter((item) => ids.includes(item.enumvalue_id))
      .reduce<string>((prevItem, item) => {
        if (prevItem && prevItem.length > 0)
          return prevItem + ", " + item.displaytext;
        else return item.displaytext;
      }, "");
    return result;
  }

  public static byIdOne(enums: Array<Enumerator>, id: number): Enumerator {
    let result = enums.find((item) => item.id == id);

    if (result) return result;
    else return new Enumerator();
  }

  public static byShort(enums: Array<Enumerator>, short: string): Enumerator {
    let result = enums.find(
      (item) => item.shorttext.toLowerCase() === short.toLowerCase()
    );
    if (result) return result;
    else return new Enumerator();
  }

  enumvalue_id;

  get languages(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.Language);
  }
  get podcastGenres(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.PodcastGenres);
  }
  get podcastTypes(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.PodcastTypes);
  }
  get authors(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.Authors);
  }
  get tags(): Array<Enumerator> {
    return this.getEnumeration(EnumKey.Tags);
  }
}
