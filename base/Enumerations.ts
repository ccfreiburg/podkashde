import IEnumerator, { getEmptyEnum } from "./types/IEnumerator";

export enum EnumKey {
  Language = 0,
  PodcastGenres = 1,
  PodcastTypes = 2,
  State = 3,
  Authors = 4,
  Tags = 5,
}

export class Enumerations {
  private list = [] as Array<IEnumerator>;

  init(list: Array<IEnumerator>) {
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
      {
        displaytext,
        shorttext,
        parentCategory,
        enumkey_id,
        enumvalue_id,
      })
  }

  public addList(list: Array<IEnumerator>) {
    list.forEach((item) => this.list.push(item));
  }

  getEnumeration(enumKey: EnumKey): Array<IEnumerator> {
    return this.list.filter((item) => item.enumkey_id === enumKey);
  }

  get isInitialized(): boolean {
    return this.list.length > 0;
  }

  public static byIdTextList(
    enums: Array<IEnumerator>,
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

  public static byIdOne(enums: Array<IEnumerator>, id: number): IEnumerator {
    let result = enums.find((item) => item.enumvalue_id == id);

    if (result) return result;
    else return getEmptyEnum();
  }

  public static byShort(enums: Array<IEnumerator>, short: string): IEnumerator {
    let result = enums.find(
      (item) => item.shorttext.toLowerCase() === short.toLowerCase()
    );
    if (result) return result;
    else return getEmptyEnum();
  }

  get languages(): Array<IEnumerator> {
    return this.getEnumeration(EnumKey.Language);
  }
  get podcastGenres(): Array<IEnumerator> {
    return this.getEnumeration(EnumKey.PodcastGenres);
  }
  get podcastTypes(): Array<IEnumerator> {
    return this.getEnumeration(EnumKey.PodcastTypes);
  }
  get authors(): Array<IEnumerator> {
    return this.getEnumeration(EnumKey.Authors);
  }
  get tags(): Array<IEnumerator> {
    return this.getEnumeration(EnumKey.Tags);
  }
}
