import type {IEnumerator} from "./types/IEnumerator"
import { getEmptyEnum } from "./types/IEnumerator"

export enum EnumKey {
  Language = 0,
  PodcastGenres = 1,
  PodcastTypes = 2,
  State = 3,
  Authors = 4,
  Tags = 5,
}

export default class Enumerations {

  public static isInitialized(list: Array<IEnumerator>) :boolean {
    return list.length>0
  } 

  public static getEnumeration(enumKey: EnumKey, list: Array<IEnumerator>): Array<IEnumerator> {
    return list.filter((item) => item.enumkey_id === enumKey);
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

  public static languages(list: Array<IEnumerator>): Array<IEnumerator> {
    return Enumerations.getEnumeration(EnumKey.Language, list);
  }
  public static podcastGenres(list: Array<IEnumerator>): Array<IEnumerator> {
    return Enumerations.getEnumeration(EnumKey.PodcastGenres, list);
  }
  public static podcastTypes(list: Array<IEnumerator>): Array<IEnumerator> {
    return Enumerations.getEnumeration(EnumKey.PodcastTypes, list);
  }
  public static authors(list: Array<IEnumerator>): Array<IEnumerator> {
    return Enumerations.getEnumeration(EnumKey.Authors, list);
  }
  public static tags(list: Array<IEnumerator>): Array<IEnumerator> {
    return Enumerations.getEnumeration(EnumKey.Tags, list);
  }
}
