import Enumerations, { EnumKey } from "./Enumerations";
import {ContentState} from "./types/ContentState"
import Episode, { getEpisode } from "~~/server/db/entities/Episode";
import Podcast, { setPodcast } from "~~/server/db/entities/Podcast";
import { strToDate } from "./Converters";
import IPodcast from "./types/IPodcast";
import IEpisode from "./types/IEpisode";
import IEnumerator from "./types/IEnumerator";
import ISerie from "./types/ISerie";

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

export function seriesfromWpMetadata(series: Array<ISerie>, wpMetadataList): Array<ISerie> {
  var list = [] as Array<ISerie>;
  wpMetadataList.forEach((meta) => {
    const serie = addExistingId(series,meta.id,
      {
        cover_file: meta.image,
        title: meta.name,
        slug: meta.slug,
        subtitle: meta.title,
        external_id: meta.id,
        description: '',
        state: ContentState.metadata,
      }) as ISerie
    list.push(serie);
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


export function allEpisodesFromWpMetadata(
  episodes : Array<IEpisode>,
  wpMetadataList,
  wpPodcastId,
  podcastImage,
  enumerations
): Array<IEpisode> {
  var list = [] as Array<IEpisode>;
  wpMetadataList.forEach((wpEpisode) => {
    list.push(episodeFromWpMetadata(episodes,wpEpisode,wpPodcastId,podcastImage,enumerations))
  })
  return list;
}

export function episodeFromWpMetadata(
  episodes : Array<IEpisode>,
  wpEpisode,
  wpPodcastId,
  podcastImage,
  enumerations
): IEpisode {
    var seriesId = wpEpisode.series.find((serieId) => serieId != wpPodcastId);
    var pubdate = strToDate(wpEpisode.meta.date_recorded);
    var image = wpEpisode.meta.cover_image;
    if (image.length < 1) image = podcastImage;
    var postimage = image;
    if (
      wpEpisode.episode_featured_image &&
      wpEpisode.episode_featured_image.length > 0
    )
      postimage = wpEpisode.episode_featured_image;
    var keyword = Enumerations.byIdTextList(
      enumerations.tags,
      wpEpisode.tags.map((item) => item.id)
    );
    var creator = Enumerations.byIdOne(
      enumerations.authors,
      wpEpisode.speaker[0]
    ).displaytext;

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
        external_id: wpEpisode.id,
        ext_podcast_id: wpPodcastId,
        ext_series_id: seriesId,
        keyword,
        creator,
      }) as IEpisode
}
