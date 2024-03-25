import Enumerations, { EnumKey } from "./Enumerations";
import {ContentState} from "./types/ContentState"
import Episode, { getEpisode } from "~~/server/db/entities/Episode";
import Podcast, { setPodcast } from "~~/server/db/entities/Podcast";
import { strToDate } from "./Converters";
import IPodcast from "./types/IPodcast";
import IEpisode from "./types/IEpisode";
import IEnumerator from "./types/IEnumerator";
import ISerie from "./types/ISerie";
import IBibleAddress from "./types/IBibleAddress.ts"
import { link } from "fs/promises";

export function enumsfromWpMetadata(
  getIdFunction,
  wpMetadataList,
  emumKey: EnumKey
): Array<IEnumerator> {
  var list = [] as Array<IEnumerator>;
  wpMetadataList.forEach((meta) => {
    const enumItem = {
        displaytext: meta.name,
        shorttext: meta.slug,
        parentCategory: meta.taxonomy,
        enumkey_id: emumKey,
        enumvalue_id: meta.id,
      }
    const id = getIdFunction(meta.id)
    if (id>=0)
      enumItem.id = id
    list.push(enumItem);
  });
  return list;
}

function addExistingId( existList: Array<ISerie | IPodcast | IEpisode>, id: number, object: ISerie | IPodcast | IEpisode) {
  const existing = existList.find((rec) => rec.external_id==id)
  if (existing)
    object.id = existing.id;
  return object
}

export function getSerieFromWp(series: Array<ISerie>, meta): ISerie {
  const serie = addExistingId(series,meta.id,
    {
      cover_file: meta.image,
      title: meta.name,
      slug: meta.slug,
      subtitle: meta.title,
      external_id: meta.id,
      description: meta.subtitle,
      state: ContentState.metadata,
      lastEpisode: new Date("1900-01-01"),
      firstEpisode: new Date()
    }) as ISerie
  return serie
}

export function seriesfromWpMetadata(series: Array<ISerie>, wpMetadataList): Array<ISerie> {
  var list = [] as Array<ISerie>;
  wpMetadataList.forEach((meta) => {
    list.push(getSerieFromWp(series, meta))
  });
  return list;
}

export function allPodcastsFromWpMetadata(
  podcasts: Array<IPodcast>,
  wpMetadataList,
  enums : IEnumerator[]
): Array<IPodcast> {
  var list = [] as Array<IPodcast>;
  wpMetadataList.forEach((wpSerie) => {
    const podcast = podcastFromWpMetadata(podcasts,wpSerie,enums)
    list.push(podcast)
  })
  return list;
}

export function podcastFromWpMetadata(
  podcasts: Array<IPodcast>,
  wpSerie,
  enums : IEnumerator[]
): IPodcast {
  return addExistingId(podcasts,wpSerie.id,
      {
        cover_file: wpSerie.image,
        title: wpSerie.name,
        slug: wpSerie.slug,
        subtitle: wpSerie.subtitle,
        author: wpSerie.author,
        summary: wpSerie.description,
        description: wpSerie.description,
        language_id: Enumerations.byShort(
          Enumerations.languages(enums),
          wpSerie.language
        ).enumvalue_id,
        category_id: Enumerations.byShort(
          Enumerations.podcastGenres(enums),
          wpSerie.category1.subcategory
        ).enumvalue_id,
        type_id: 1, //1=episodic,
        explicit: wpSerie.explicit_option != "",
        link: wpSerie.link,
        copyright: wpSerie.copyright,
        owner_name: wpSerie.owner_name,
        owner_email: wpSerie.owner_email,
        lastbuild: "0",
        state: ContentState.metadata,
        external_id: wpSerie.id,
      }) as IPodcast
}


export function episodeFromWpMetadata(
  episodes : Array<IEpisode>,
  wpEpisode,
  wpPodcastId,
  seriesId,
  podcastImage,
  enumerations
): IEpisode {
 // console.log(JSON.stringify(wpEpisode))
    var pubdate = strToDate((wpEpisode.meta.date_recorded.length>0?wpEpisode.meta.date_recorded:wpEpisode.date))
    if (!pubdate)
      pubdate = new Date();
    var image = wpEpisode.meta.cover_image;
    if (image.length < 1) image = podcastImage;
    var postimage = image;
    if (
      wpEpisode.episode_featured_image &&
      wpEpisode.episode_featured_image.length > 0
    )
      postimage = wpEpisode.episode_featured_image;
    var keyword = wpEpisode.tags.map((id) => enumerations.getTag(id).displaytext).join(', ')
    var creator = (wpEpisode.speaker?enumerations.getAuthor(wpEpisode.speaker[0]).displaytext:'');
    if (creator.length<1)
      creator = autorFromDescription(wpEpisode.excerpt.rendered)
    var cross_ref = verseFromDescription(wpEpisode.content.rendered)
    
    return addExistingId(episodes, wpEpisode.id, {
        title: wpEpisode.title.rendered,
        slug: wpEpisode.slug,
        subtitle: wpEpisode.excerpt.rendered,
        summary: wpEpisode.excerpt.rendered,
        description: wpEpisode.content.rendered,
        explicit: wpEpisode.meta.explicit,
        block: wpEpisode.meta.block,
        link: wpEpisode.meta.audio_file,
        pubdate,
        duration: wpEpisode.meta.duration,
        image,
        postimage,
        rawsize: wpEpisode.meta.filesize_raw,
        state: 0,
        video_link: linkFromDescription(wpEpisode.content.rendered,"ideo"),
        cross_ref: cross_ref.raw,
        external_id: wpEpisode.id,
        ext_podcast_id: wpPodcastId,
        ext_series_id: seriesId,
        keyword,
        creator,
      }) as IEpisode
}

export function linkFromDescription(description: string, match = "") : string {
  const regex = new RegExp("<a\\s+(?:[^>]*?\\s+)?href=\\\\?\"(http[s]*:\\/\\/.*)\\\\?\".*" +match+".*<\/a>")
  const groups =  description.match(regex)
  const result = (groups && groups.length>1?groups[1]:"")
  if (result.endsWith("\\"))
    return result.slice(0,-1)
  return result
}

export function autorFromDescription(description: string) : string {
  const regex = /\s\/\/\s([a-zA-Z\s]+).*(\s|\Z|<|\/\/).*/
  const groups =  description.match(regex)
  return (groups && groups.length>1?groups[1].trim():"")
}

export function verseFromDescription(description: string) : IBibleAddress {
  const regex = /(([1-3]?\.?[A-Za-z]+)[\. ]([1-9][0-9]*)[\:,.]?(\d*)[-+]?(\d*)( - \d+)?)/
  const match =  description.match(regex)
  var result : IBibleAddress = {
    book: "",
    raw: "",
    chapter: 0,
    verse: 0
  }
  if (match) {
    result.book = match[2]
    result.raw = match [0]
    if (match[3])
      result.chapter = Number.parseInt(match[3])
    if (match[4])
      result.verse = Number.parseInt(match[4])
    if (match[5])
      result.to_verse = Number.parseInt(match[5])
  }
  return result
}