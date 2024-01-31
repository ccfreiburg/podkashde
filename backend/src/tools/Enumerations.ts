import Enumerator from "../entities/Enumerator";

export enum EnumKey {
  Language = 0,
  PodcastGenres = 1,
  PodcastTypes = 2,
  State = 3,
  Authors = 4,
  Tags = 5,
}

export function getEmptyEnum(): Enumerator {
  var enumer = {
    displaytext: "",
    shorttext: "",
    parentCategory: "",
    enumkey_id: -1,
    enumvalue_id: -1,
  };
  return enumer as Enumerator;
}
export default class Enumerations {
  public static isInitialized(list: Array<Enumerator>): boolean {
    return list.length > 0;
  }

  public static getEnumeration(
    enumKey: EnumKey,
    list: Array<Enumerator>
  ): Array<Enumerator> {
    return list.filter((item) => item.enumkey_id === enumKey);
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
    let result = enums.find((item) => item.enumvalue_id == id);

    if (result) return result;
    else return getEmptyEnum();
  }

  public static byShort(enums: Array<Enumerator>, short: string): Enumerator {
    let result = enums.find(
      (item) => item.shorttext.toLowerCase() === short.toLowerCase()
    );
    if (result) return result;
    else return getEmptyEnum();
  }

  public static languages(list: Array<Enumerator>): Array<Enumerator> {
    return Enumerations.getEnumeration(EnumKey.Language, list);
  }
  public static podcastGenres(list: Array<Enumerator>): Array<Enumerator> {
    return Enumerations.getEnumeration(EnumKey.PodcastGenres, list);
  }
  public static podcastTypes(list: Array<Enumerator>): Array<Enumerator> {
    return Enumerations.getEnumeration(EnumKey.PodcastTypes, list);
  }
  public static authors(list: Array<Enumerator>): Array<Enumerator> {
    return Enumerations.getEnumeration(EnumKey.Authors, list);
  }
  public static tags(list: Array<Enumerator>): Array<Enumerator> {
    return Enumerations.getEnumeration(EnumKey.Tags, list);
  }
}

export function getEnumFunctions(enums: Array<Enumerator>) {
  return {
    getLanguage: (lang_id: number): Enumerator => {
      return Enumerations.byIdOne(Enumerations.languages(enums), lang_id);
    },

    getGenre: (genre_id: number): Enumerator => {
      return Enumerations.byIdOne(Enumerations.podcastGenres(enums), genre_id);
    },

    getAuthor: (autor_id: number): Enumerator => {
      return Enumerations.byIdOne(Enumerations.authors(enums), autor_id);
    },

    getTag: (tag_id: number): Enumerator => {
      return Enumerations.byIdOne(Enumerations.tags(enums), tag_id);
    },
    getType: (type_id: number): Enumerator => {
      return Enumerations.byIdOne(Enumerations.podcastTypes(enums), type_id);
    },
  };
}
